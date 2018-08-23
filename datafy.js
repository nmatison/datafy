let width = 1400
let height = 750

simulation = d3.forceSimulation()
.force("center", d3.forceCenter(width / 2, height / 2))
.force("charge", d3.forceManyBody().strength(-14))
.force("collide", d3.forceCollide(75).strength(0.45))
.alphaTarget(0.01)
// .alpha(1)

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
   .attr("class", "parentCircle")
   .attr("cx", function (d) { return d.x_axis; })
   .attr("cy", function (d) { return d.y_axis; })
   .attr("r", function (d) { return d.radius; })
   .attr("id", function (d) {return d.id; })
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
        artists(d, data, textCircles)
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

 function artists(parent, parentData, textCircles) {
   d3.csv(parent.data).then(function(data) {
       let totalStreams = calcStreams(data);
       calcRadius(data, totalStreams)
       let links = createLinks(parent.id, data)
       let graph = {"data": data, "links": links}
       console.log(graph)
       appendChildren(graph, parent)
       simulation.nodes(data.concat(parentData))
       // .force("link", d3.forceLink(links).id(function(d) { return d.id; }).distance(40))
       .on("tick", ticked)

       function ticked() {
         let circles = svg.selectAll("circle")
         let text = svg.selectAll("text")
         text
         .attr('x', function (d) {return d.x; })
         .attr('y', function (d) {return d.y; })
         circles
          .attr("cx", function(d) { return d.x = Math.max(d.radius, Math.min(width - d.radius, d.x)); })
          .attr("cy", function(d) { return d.y = Math.max(d.radius, Math.min(height - d.radius, d.y)); })
       }
     })
   }

// function artists(parent, parentData, textCircles) {
//   d3.csv(parent.data).then(function(data) {
//     let totalStreams = calcStreams(data);
//     let artistData = getArtists(data);
//     calcRadius(artistData, totalStreams);
//     let links = createLinks(parent.id, artistData);
//     let graph = {"data": artistData, "links": links}
//     appendChildren(graph, parent)
//     simulation.nodes(artistData)
//     artistSim(graph.data, graph.links);
//   });
// }

function calcStreams(data) {
  let totalStreams = 0
  for (var i = 0; i < data.length; i++) {
    totalStreams += parseInt(data[i].Streams)
  }
  console.log(totalStreams)
  return totalStreams;
}


function calcRadius(data, totalStreams) {
  for (var i = 0; i < data.length; i++) {
    data[i].radius = (parseInt(data[i].Streams) / totalStreams) * 500
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
  let links = [];
  for (var i = 0; i < childData.length; i++) {
    links.push({"source": parentId, "target": childData[i].id})
  }
  return links;
}

function appendChildren(graph, parent) {

  for (var i = 0; i < graph.data.length; i++) {
    d3.select(".svg")
      .append("circle")
      .attr("class", "artistCircle")

    d3.select(".svg")
    .append("line")
    .attr("class", "artistLink")
  }

  svg.selectAll(".artistCircle")
    .data(graph.data)
    .attr("x", function (d) { return parent.x; })
    .attr("y", function (d) { return parent.y; })
    .attr("r", function (d) { return d.radius; })
    .style("fill", function (d) { return parent.color; })

  svg.selectAll(".artistLink")
    .data(graph.links)
    .attr("stroke-width", 2)
    .attr("stroke", "black")
}

// function artistSim(data, links) {
  // circle = d3.selectAll("circle")
  // circle = circle.data(data, function(d) { return d.id})
  // circle.exit()
  //       .remove()
  // circle = circle.enter().append("circle")
  // simulation.nodes(data)
  // simulation.alpha(1).restart()
  //
// }

// function artistTicked() {
//   let artistCircles = svg.select(".artistCircle")
//   let links = svg.select(".artistLink")
//   artistCircles
//     .attr('cx', function (d) {return d.x; })
//     .attr('cy', function (d) {return d.y; })
//   links
//     .attr("x1", function(d) { return d.source.x_axis; })
//     .attr("y1", function(d) { return d.source.y_axis; })
//     .attr("x2", function(d) { return d.target.x; })
//     .attr("y2", function(d) { return d.target.y; })
// }
