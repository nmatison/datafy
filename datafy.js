let width = 1400
let height = 750

let simulation = d3.forceSimulation()
// simulation.stop();



let svg = d3.select(".container")
.append("svg")
.attr("width", width)
.attr("height", height)
.append("g")
.attr("transform", "translate(0,0)")
.attr("class", "svg")

d3.csv("parent-nodes.csv").then(function(data) {
  console.log(data)

 let parentCircles = svg.selectAll("circle")
   .data(data)
   .enter()
   .append("circle")
   .attr("cx", function (d) { return d.x_axis; })
   .attr("cy", function (d) { return d.y_axis; })
   .attr("r", function (d) { return d.radius; })
   .style("fill", function (d) { return d.color; })

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
  .force("charge", d3.forceManyBody().strength(-30))
  .force("collide", d3.forceCollide(75).strength(0.9))
  .on("tick", ticked)

  function ticked() {
    parentCircles
      .attr('cx', function (d) {return d.x; })
      .attr('cy', function (d) {return d.y; })
    textCircles
      .attr('x', function (d) {return d.x; })
      .attr('y', function (d) {return d.y; })
  }

 })


















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
