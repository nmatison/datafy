let width = 1400
let height = 750

simulation = d3.forceSimulation()
.force("center", d3.forceCenter(width / 2, height / 2))
.force("charge", d3.forceManyBody().strength(-14))
.force("collide", d3.forceCollide(70).strength(1))
.alphaTarget(0.01)

let svg = d3.select(".container")
.append("svg")
.attr("width", width)
.attr("height", height)
.append("g")
.attr("transform", "translate(0,0)")
.attr("class", "svg")

d3.csv("parent-nodes.csv").then(function(data) {
  parentData = data
 let parentCircles = svg.selectAll("circle")
   .data(parentData)
   .enter()
   .append("circle")
   .attr("class", "parentCircle")
   .attr("cx", function (d) { return d.x_axis; })
   .attr("cy", function (d) { return d.y_axis; })
   .attr("r", function (d) { return d.radius; })
   .attr("id", function (d) {return d.id; })
   .style("fill", function (d) { return d.color; })
   .on('mouseover', enlarge)
   .on('mouseout', normalize)

  let textCircles = svg.selectAll(".parentText")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "parentText")
    .attr("x", function(d) {return d.x_axis; })
    .attr("y", function(d) {return d.y_axis; })
    .text( function (d) { return d.text })
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("fill", "black")
    .attr("text-anchor", "middle")

  simulation.nodes(parentData)
      .on("tick", ticked)

  function ticked() {
    parentCircles
      .attr('cx', function (d) {return d.x; })
      .attr('cy', function (d) {return d.y; })
    textCircles
      .attr('x', function (d) {return d.x; })
      .attr('y', function (d) {return d.y; })
  }

  svg.selectAll("circle")
    .on("click", function(d) {
      d.clicked = !d.clicked;
      if (d.clicked) {
        artists(d)
        deleteSongCircles()
      } else {
        deleteSongCircles()
        deleteArtistCircles()
        simulation.nodes(data)
            .on("tick", ticked)
      }
    });

    function enlarge(d) {
      d3.select(this)
      .transition()
      .duration(200)
      .attr('stroke', d.color.darker)
      .attr('r', function(d) {return (d.radius*1.1)})
    }

    function normalize(d) {
        d3.select(this)
        .transition()
        .duration(200)
        .attr('stroke', d.color)
        .attr('r', function(d) {return d.radius})
    }
 })

 function songs(parent) {
   deleteSongCircles()
   let totalStreams = calcStreams(songData);
   let artistSongData = filterSongs(parent);
   calcRadius(artistSongData, totalStreams)
   appendChildren(artistSongData, parent)
   simulation.nodes(artistSongData.concat(artistData, parentData))
     .force("center", d3.forceCenter(width / 2, height / 2))
     .force("charge", d3.forceManyBody().strength(-14))
     .force("collide", d3.forceCollide(75).strength(1))
     .alphaTarget(0.01)
     .on("tick", ticked)


   function ticked() {
     let circles = svg.selectAll("circle")
     let text = svg.selectAll("text")

     text
     .attr('x', function (d) {return d.x; })
     .attr('y', function (d) {return d.y; })
     circles
      .attr("cx", function(d) { return d.x = Math.max(d.radius, Math.min(width - d.radius, d.x), 120); })
      .attr("cy", function(d) { return d.y = Math.max(d.radius, Math.min(height - d.radius, d.y), 120); })
   }
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
  d3.csv(parent.data).then(function(data) {
    songData = data
    let totalStreams = calcStreams(data);
    artistData = getArtists(data);
    calcRadius(artistData, totalStreams);
    appendChildren(artistData, parent, totalStreams)
    svg.selectAll(".artistCircle")
      .on("click", function(d) {
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
      .force("charge", d3.forceManyBody().strength(-14))
      .force("collide", d3.forceCollide(75).strength(1))
      .alphaTarget(0.01)
      .on("tick", ticked)

    function ticked() {
      let circles = svg.selectAll("circle")
      let text = svg.selectAll("text")

      text
        .attr('x', function (d) { return d.x; })
        .attr('y', function (d) { return d.y; })
      circles
       .attr("cx", function(d) { return d.x = Math.max(d.radius, Math.min(width - d.radius, d.x), 120); })
       .attr("cy", function(d) { return d.y = Math.max(d.radius, Math.min(height - d.radius, d.y), 120); })
    }
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
        radius = percent * 1200
        data[i].radius = radius
        continue
      } else if (percent < 0.040) {
        radius = percent * 800
        data[i].radius = radius
        continue
      } else if (percent < 0.060) {
        radius = percent * 350
        data[i].radius = radius
        continue
      } else {
        radius = percent * 175
        data[i].radius = radius
        continue
      }
    }
  }
}

function getArtists(data) {
  let artistData = []
  let artistDataAndStreams;
  for (var i = 0; i < data.length; i++) {
    if (artistData.every((obj) => data[i].Artist !== obj.Artist)) {
      artistId = `${data[i].Artist.slice(0, 2)}${data[i].Streams.slice(0, 4)}`
      artistData.push({"id": data[i].Position, "Artist": data[i].Artist, "Streams": 0 })
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
    var type = "song"
    var className = "songCircle";
  } else {
    var type = "artist"
    var className = "artistCircle";
  }

  for (var i = 0; i < data.length; i++) {
    d3.select(".svg")
      .append("circle")
      .attr("class", `${className}`)
    }
  svg.selectAll(`.${className}`)
    .data(data)
    .attr("x", function (d) { return width/2; })
    .attr("y", function (d) { return height/2; })
    .attr("r", function (d) { return d.radius; })
    .attr("id", function(d) { return d.id })
    .style("fill", function (d) { return parent.color; })
    .on("mouseover", function(d){
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
        .attr("r", 120)
      d3.select(".svg")
        .append("text")
        .attr("class", `${type}Text`)
        .data(node.data())
        .attr("text-anchor", "middle")
        .attr("x", function(d) {return d.x;})
        .attr("y", function(d) {return d.y; })
        .text(songData[this.id -1].Artist)
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .attr("fill", "black")
      d3.select(".svg")
        .append("text")
        .attr("class", `${type}Text`)
        .data(node.data())
        .attr("text-anchor", "middle")
        .attr("x", function(d) {return d.x;})
        .attr("y", function(d) {return d.y;})
        .text(`Total Streams: ${totalStreams}`)
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .attr("fill", "black")


    })
    .on("mouseout", function(d) {
      svg.selectAll("circle")
        .transition()
        .duration(200)
        .style("opacity", 1.0)
        .transition()
        .duration(200)
        .attr("r", function (d) { return d.radius; })
      svg.selectAll("text")
        .transition()
        .duration(200)
        .style("opacity", 1.0)
      svg.selectAll(".artistText").remove()
    })
}

function appendText(that, type, parent) {
  let data = songData[that.id]
  let text = d3.select(".svg")
    .append("text")
    .attr("class", `${type}Text`)

    text
    .data([data])
    .attr("x", function (d) { return width / 2; })
    .attr("y", function (d) { return height / 2; })
    .text( data.Artist )
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
}

function deleteArtistCircles() {
  svg.selectAll(".artistCircle").remove();
}

function deleteSongCircles() {
  svg.selectAll(".songCircle").remove();
}
