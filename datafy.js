let width = 1400
let height = 750

let simulation = d3.forceSimulation()

let svg = d3.select(".container")
.append("svg")
.attr("width", width)
.attr("height", height)
.append("g")
.attr("transform", "translate(0,0)")
.attr("class", "svg")

d3.csv("parent-nodes.csv").then(function(data) {
 let parentCircles = svg.selectAll("circle")
   .data(data)
   .enter()
   .append("circle")
   .attr("cx", function (d) { return d.x_axis; })
   .attr("cy", function (d) { return d.y_axis; })
   .attr("r", function (d) { return d.radius; })
   .style("fill", function (d) { return d.color; })
   .on('mouseover', enlarge)
   .on('mouseout', normalize)

  let textCircles = svg.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("x", function(d) {return d.x_axis; })
    .attr("y", function(d) {return d.y_axis; })
    .text( function (d) { return d.text })
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("fill", "black")
    .attr("text-anchor", "middle")

  simulation.nodes(data)
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force("charge", d3.forceManyBody().strength(-14))
  .force("collide", d3.forceCollide(75).strength(0.45))
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
      } else {
        console.log("close")
      }
    });

    function enlarge(d) {
      d3.select(this)
      .attr('stroke', d.color.darker)
      .attr('r', function(d) {return (d.radius*1.1)})
    }

    function normalize(d) {
        d3.select(this)
        .attr('stroke', d.color)
        .attr('r', function(d) {return d.radius})
    }
 })

function artists(parent) {
  d3.csv(parent.data).then(function(data) {
    let totalStreams = calcStreams(data);
    let artistData = getArtists(data);
    calcRadius(artistData, totalStreams);
    let links = createLinks(parent.id, artistData);
    let graph = {"data": artistData, "links": links}
    appendChildren(graph, parent)
  });
}
  //   let artistLinks = svg.selectAll("link")
  //     .data(graph.links)
  //     .enter()
  //     .append("line")
  //     .attr("class", "artistLink")
  //
  //   let artistCircles = svg.selectAll("circle")
  //     .data(graph.artistData)
  //     .enter()
  //     .append("circle")
  //     .attr("cx", function (d) { return parent.x_axis; })
  //     .attr("cy", function (d) { return parent.y_axis; })
  //     .attr("r", function (d) { return d.radius; })
  //     .style("fill", function (d) { return parent.color; })
  // })


function calcStreams(data) {
  let totalStreams = 0
  for (var i = 0; i < data.length; i++) {
    totalStreams += parseInt(data[i].Streams)
  }
  return totalStreams;
}


function calcRadius(data, totalStreams) {
  for (var i = 0; i < data.length; i++) {
    data[i].radius = (parseInt(data[i].Streams) / totalStreams) * 200
  }
}

function getArtists(data) {
  let artistData = []
  let artistDataAndStreams;
  for (var i = 0; i < data.length; i++) {
    if (artistData.every((obj) => data[i].Artist !== obj.Artist)) {
      artistId = `${data[i].Artist.slice(0, 2)}${data[i].Streams.slice(0, 4)}`
      artistData.push({"id": artistId, "Artist": data[i].Artist, "Streams": 0 })
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

function createLinks(parentId, childData) {
  let links = []
  for (var i = 0; i < childData.length; i++) {
    links.push({"source": parentId, "target": childData[i].id})
  }
  return links;
}

function appendChildren(graph, parent) {
  for (var i = 0; i < graph.data.length; i++) {
    d3.select(".svg")
    .append("circle")
      .data(graph.data[i])
      .enter()
      .attr("cx", function (d) { return parent.x_axis; })
      .attr("cy", function (d) { return parent.y_axis; })
      .attr("r", function (d) { return d.radius; })
      .style("fill", function (d) { return parent.color; })
  }
}
