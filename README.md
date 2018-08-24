# datafy

[Live Link](https://nmatison.github.io/datafy/)

## Background

Datafy is a data visualization project that takes weekly Spotify data from the most recent six months, and display it as an interactive form using `Javascript` and the `d3.js` library.


## Features

Users can open the page to circles representing each month's worth of data. Clicking on a circle will result in a chain of info becoming available through more circle objects:

+ Clicking on one month will shoot out smaller data objects that represents the top artists whose songs made it in the top 25 songs on the top 200 chart for that week. The top 200 is determined by the number of streams a song received that week. Each circle's size being relative to the artist's position on the charts for that week:

![artist_gif](https://github.com/nmatison/datafy/blob/master/images/artist.gif)

+ Clicking on the artist's circle will shoot out even more smaller data objects that display the song name along with the amount of times it had been streamed that week. The song circles will also be linked to the specific song on Spotify so users will be able to instantly listen to the song.

![song_gif](https://github.com/nmatison/datafy/blob/master/images/song.gif)

## Creating the Artist and Song Circles

One of the biggest challenges faced in this project was structuring the artist and song circles with the correct data. In order for the project to function as planned, this data had to be precise in terms of:
 + Artist data
 + Track name
 + Total Streams for each artist
 + Radius calculations based on streams for songs and artist
 + X and Y coordinates for each circle
 + The hover effects for each artist and song circle
 + The correct spotify link being appended to each individual song circle
 
 To do this, a function was created that could be easily used for the generation of both artist and song circles to keep the code as DRY as possible:

   ```js
   
   // The circles are first created in a separate function not highlighted here. Then, the stats are applied using d3 selectors and attributes based on whether a circle represents a song or an artist .
    
  svg.selectAll(`.${className}`)
    .data(data)
    .attr("x", function (d) { return 0; })
    .attr("y", function (d) { return 0; })
    .attr("r", function (d) { return d.radius; })
    .attr("id", function(d) { return d.id })
    .style("fill", function (d) { return color; })
    
   // Now the hover functions need to be added on. These are determined by whether the data contains a URL header or not. The artist data does not contain this header.
   
    .on("mouseover", function(d){
      if (data[0].URL) {
        var firstText = songData[this.id -1].Track
      } else {
        var firstText = songData[this.id -1].Artist
      }
      var streams = d.Streams
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
      d3.select(".svg")
        .append("text")
        .attr("class", `${type}Text`)
        .data(node.data())
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "hanging")
        .text(`${streams.toLocaleString()}`)
        .attr("font-family", "Montserrat", "sans-serif")
        .attr("font-size", "20px")
        .attr("fill", "white")

        if (type === "song") {
          d3.select(this)
            .on("click", function(d) {
              window.open(songData[this.id -1].URL, '_blank')
            })
          }
        })
        
    // This function will set everything back to normal after a user has stopped hovering over the circle.

    .on("mouseout", function(d) {
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

 
 ```

## Architecture and Technologies

Datafy uses the following technologies:

+ `d3.js` is used for the overall structure and svg logic. The symbols, physics text and everything that is displayed but the title, description, and links at the bottom of the page are all controlled by the `d3.js` library.
+ `HTML5` for the basic structure
+ `CSS` to help with the page layout

The project also includes data from [Spotify Charts](https://spotifycharts.com/regional/global/weekly/2018-08-10--2018-08-17) in csv form.


## Bonus Features
Add a user login with Spotify's api. This would allow for the app to pull data from the user's profile and specific live information regarding artists and their songs. This would open up a whole world of possibilities including:
+ live stats for the song's stream count
+ personalized data for a user's playlist and songs (most played songs, favorite category, favorite album, etc).
+ comparison of personalized user data and overall Spotify data.
