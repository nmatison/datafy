let width = 1400
let height = 750

let parentCircleData = [
  { "x_axis": 150, "y_axis": 650, "radius": 100, "color" : "green", "text": "March 2018" },
  { "x_axis": 70, "y_axis": 70, "radius": 100, "color" : "purple", "text": "April 2018"},
  { "x_axis": 350, "y_axis": 250, "radius": 100, "color" : "red", "text": "May 2018"},
  { "x_axis": 550, "y_axis": 600, "radius": 100, "color" : "blue", "text": "June 2018"},
  { "x_axis": 880, "y_axis": 150, "radius": 100, "color" : "orange", "text": "July 2018"},
  { "x_axis": 600, "y_axis": 450, "radius": 100, "color" : "yellow", "text": "August 2018"},
]

let svg = d3.select(".container")
 .append("svg")
 .attr("width", width)
 .attr("height", height)
 .append("g")
 .attr("transform", "translate(0,0)")

let parentCircles = svg.selectAll("circle")
  .data(parentCircleData)
  .enter()
  .append("circle")

let circleAttributes = parentCircles
  .attr("cx", function (d) { return d.x_axis; })
  .attr("cy", function (d) { return d.y_axis; })
  .attr("r", function (d) { return d.radius; })
  .style("fill", function(d) { return d.color; });

let text = svg.selectAll("text")
  .data(parentCircleData)
  .enter()
  .append("text")

let textLabels = text
  .attr("x", function(d) {return (`${parseInt(d.x_axis) - 40}`)})
  .attr("y", function(d) {return d.y_axis; })
  .text( function (d) { return d.text })
  .attr("font-family", "sans-serif")
  .attr("font-size", "20px")
  .attr("fill", "black")

let simulation = d3.forceSimulation()
  .velocityDecay(0.2)
  .force('x', d3.forceX(width / 2).strength(0.05))
  .force('y', d3.forceY(height / 2).strength(0.05))
  .force('charge', d3.forceManyBody().strength(0.05))
  .on('tick', ticked);

function ticked() {
  parentCircles
    .attr('cx', function (d) {return d.x_axis; })
    .attr('cy', function (d) {return d.y_axis; })
}

simulation.nodes(parentCircles)



















// d3.csv("02-23--03-02.csv", (datapoints) => ready(datapoints))


//
// function ready(datapoints, error) {
//   var circles = svg.selectAll(".artist")
//   .data(datapoints.Artist)
//   .enter().append("circle")
//   .attr("class", "artist")
//   .attr("cx", 100)
//   .attr("cy", 300)
//   .attr("r", 10)
//   .attr("fill", "lightblue")



  // var simulation = d3.forceSimulation()
  // function ticked() {
  //   circles.each(function (node) {})
  //     .attr("cx", function(d) {
  //       return d.x
  //     })
  //     .attr("cy", function(d) {
  //       return d.y
  //     })
    // }
  // }
