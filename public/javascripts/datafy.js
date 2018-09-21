import { fetchToken, fetchSongInfo }  from "./util";


fetchToken().then(token => {
  let authToken = token.data;
  let songData; 
  let simulation;
  let parentData;
  let artistId;
  let artistsAndStreams;
  let artistData;
  let node;

  let width = 1200
  let height = 650


  simulation = d3.forceSimulation()
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("charge", d3.forceManyBody().strength(-20))
    .force("collide", d3.forceCollide(70).strength(0.50))
    .alphaTarget(0.01)

  let svg = d3.select(".container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(0,0)")
    .attr("class", "svg")

  d3.csv("../data/parent-nodes.csv").then(function (data) {
    parentData = data
    let parentCircles = svg.selectAll("circle")
      .data(parentData)
      .enter()
      .append("circle")
      .attr("class", "parentCircle")
      .attr("cx", function (d) { return d.x_axis; })
      .attr("cy", function (d) { return d.y_axis; })
      .attr("r", function (d) { return d.radius; })
      .attr("id", function (d) { return d.id; })
      .style("fill", function (d) { return d.color; })
      .on('mouseover', enlarge)
      .on('mouseout', normalize)

    let textCircles = svg.selectAll(".parentText")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "parentText")
      .attr("x", function (d) { return d.x_axis; })
      .attr("y", function (d) { return d.y_axis; })
      .text(function (d) { return d.text })
      .attr("font-family", "Montserrat", "sans-serif")
      .attr("font-size", "20px")
      .attr("fill", "rgb(235, 235, 235)")
      .attr("text-anchor", "middle")
      .attr("text-anchor", "middle")
      .attr("letter-spacing", "0.5")
      .attr("font-weight", "bold")
    simulation.nodes(parentData)
      .on("tick", ticked)

    function ticked() {
      parentCircles
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; })
      textCircles
        .attr('x', function (d) { return d.x; })
        .attr('y', function (d) { return d.y; })
    }

    svg.selectAll("circle")
      .on("click", function (d) {
        artists(d)
        deleteSongCircles()
      });

    function enlarge(d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('stroke', d.color.darker)
        .attr('r', function (d) { return (d.radius * 1.1) })
        .style("cursor", "pointer")
    }

    function normalize(d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('stroke', d.color)
        .attr('r', function (d) { return d.radius })
        .style("cursor", "default")
    }
  })

  function songs(parent) {
    deleteSongCircles()
    let totalStreams = calcStreams(songData);
    let artistSongData = filterSongs(parent);
    getSongInfo(artistSongData);
    calcRadius(artistSongData, totalStreams);
    appendChildren(artistSongData, parent, totalStreams)
    simulation.nodes(artistSongData.concat(artistData, parentData))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("charge", d3.forceManyBody().strength(-20))
      .force("collide", d3.forceCollide(81).strength(0.50))
      .alphaTarget(0.01)
      .on("tick", ticked)
    }

    function ticked() {
      let circles = svg.selectAll("circle")
      let text = svg.selectAll("text")

      text
        .attr('x', function (d) { return d.x; })
        .attr('y', function (d) { return d.y; })
      circles
        .attr("cx", function (d) { return d.x = Math.max(d.radius, Math.min(width - d.radius, d.x), 125); })
        .attr("cy", function (d) { return d.y = Math.max(d.radius, Math.min(height - d.radius, d.y), 125); })
    }

  function filterSongs(parent) {
    let result = [];
    for (let s = 0; s < songData.length; s++) {
      if (songData[s].Artist === parent.Artist) result.push(songData[s])
    }
    return result;
  }

  function artists(parent) {
    deleteArtistCircles()
    d3.csv(parent.data).then(function (data) {
      songData = data;
      let totalStreams = calcStreams(data);
      artistData = getArtists(data);
      artistData = getArtistImg(artistData);
      calcRadius(artistData, totalStreams);
      appendChildren(artistData, parent, totalStreams);
      svg.selectAll(".artistCircle")
        .on("click", function (d) {
          d.clicked = !d.clicked;
          if (d.clicked) {
            songs(d)
          } else {
            deleteSongCircles()
            simulation.nodes(data)
              .on("tick", ticked)
          }
        });

      simulation.nodes(artistData.concat(parentData))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("charge", d3.forceManyBody().strength(-20))
        .force("collide", d3.forceCollide(81).strength(0.5))
        .alphaTarget(0.01)
        .on("tick", ticked)
    });
  }

  function calcStreams(data) {
    let totalStreams = 0
    for (var i = 0; i < data.length; i++) {
      totalStreams += parseInt(data[i].Streams)
    }
    return totalStreams;
  }


  function calcRadius(data, totalStreams) {
    var radius;
    if (data[0].URL) {
      for (var i = 0; i < data.length; i++) {
        radius = (parseInt(data[i].Streams) / totalStreams) * 650
        data[i].radius = radius
      }
    } else {
      for (var i = 0; i < data.length; i++) {
        let percent = (parseInt(data[i].Streams) / totalStreams)
        if (percent < 0.020) {
          radius = percent * 900
          data[i].radius = radius
          continue
        } else if (percent < 0.040) {
          radius = percent * 900
          data[i].radius = radius
          continue
        } else if (percent < 0.060) {
          radius = Math.min(percent * 900, 82)
          data[i].radius = radius
          continue
        } else {
          radius = Math.min(percent * 900, 107)
          data[i].radius = radius
          continue
        }
      }
    }
  }

  function getArtists(data) {
    let artistData = []
    // let artistDataAndStreams;
    for (var i = 0; i < data.length; i++) {
      if (artistData.every((obj) => data[i].Artist !== obj.Artist)) {
        artistId = `${data[i].Artist.slice(0, 2)}${data[i].Streams.slice(0, 4)}`
        artistData.push({ "id": data[i].id, "Artist": data[i].Artist, "Streams": 0 })
      }
    } artistsAndStreams = getArtistStreams(data, artistData)
    return artistsAndStreams
  }

  function getArtistStreams(data, artistData) {
    for (var i = 0; i < artistData.length; i++) {
      if (artistData[i].Streams === 0) {
        for (var j = 0; j < data.length; j++) {
          if (artistData[i].Artist === data[j].Artist) {
            artistData[i].Streams += parseInt(data[j].Streams)
          }
        }
      }
    }
    return artistData
  }


  function appendChildren(data, parent, totalStreams) {
    if (data[0].URL) {
      var type = "song";
      var className = "songCircle";
      var color = "#ffa600";

    } else {
      var type = "artist";
      var className = "artistCircle";
      var color = parent.color;

    }

    for (var i = 0; i < data.length; i++) {
      d3.select(".svg")
        .append("circle")
        .attr("class", `${className}`)
    }
    svg.selectAll(`.${className}`)
      .data(data)
      .attr("x", function (d) { return 0; })
      .attr("y", function (d) { return 0; })
      .attr("r", function (d) { return d.radius; })
      .attr("id", function (d) { return d.id })
      .style("fill", function (d) { return color; })
      .on("mouseover", function (d) {
        if (data[0].URL) {
          var firstText = songData[this.id - 1].Track
        } else {
          var firstText = songData[this.id - 1].Artist
        }
        var streams = d.Streams
        if (typeof streams === "string") var streams = parseInt(d.Streams)
        node = d3.select(this)
        svg.selectAll("circle")
          .transition()
          .duration(200)
          .style("opacity", 0.5)
        svg.selectAll(".parentText")
          .transition()
          .duration(200)
          .style("opacity", 0.5)
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 1.0)
          .attr("r", 125)
          .style("cursor", "pointer")
        d3.select(".svg")
          .append("text")
          .attr("class", `${type}Text`)
          .data(node.data())
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "ideographic")
          .text(firstText)
          .attr("font-family", "Montserrat", "sans-serif")
          .attr("font-size", "20px")
          .attr("fill", "white")
          .attr("")
        d3.select(".svg")
          .append("text")
          .attr("class", `${type}Text`)
          .data(node.data())
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "hanging")
          .text(`${streams.toLocaleString()} Streams`)
          .attr("font-family", "Montserrat", "sans-serif")
          .attr("font-size", "20px")
          .attr("fill", "white");


        if (type === "song") {
          d3.select(this)
            .on("click", function (d) {
              window.open(songData[this.id - 1].URL, '_blank')
            })
        }
      })

      .on("mouseout", function (d) {
        svg.selectAll("circle")
          .transition()
          .duration(200)
          .style("opacity", 1.0)
          .transition()
          .duration(200)
          .attr("r", function (d) { return d.radius; })
          .style("cursor", "default")
        svg.selectAll("text")
          .transition()
          .duration(200)
          .style("opacity", 1.0)
        svg.selectAll(`.${type}Text`).remove()
      })
  }

  function deleteArtistCircles() {
    svg.selectAll(".artistCircle").remove();
  }

  function deleteSongCircles() {
    svg.selectAll(".songCircle").remove();
  }

  function getArtistImg(artistData) {
    return artistData;
  }

  function getSongInfo(songData) {
    for (let i = 0; i < songData.length; i++) {
      fetchSongInfo(songData[i].URL.slice(31), authToken)
      .then((songInfo) => {
        songData[i].albumImage = songInfo.data.albumImage;
        songData[i].albumName = songInfo.data.albumName;
        songData[i].releaseDate = songInfo.data.releaseDate;
        songData[i].explicit = songInfo.data.explicit;
        songData[i].popularity = songInfo.data.popularity;

      })
    }
    return songData
  }

  
});