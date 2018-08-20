# datafy

## Background and Overview

Datafy is a data visualization project that takes weekly Spotify data from 03/30/2018 through 08/16/2018, and display it as an interactive form.

Users will open the page to circles representing each month's worth of data. Clicking on a circle will result in a chain of info becoming available through more circle objects:
+ Clicking on one month will shoot out smaller data objects that represents the artists that made it on the top 200 chart for that week. Each circle's size being relative to the artist's position on the charts for that week.
+ Clicking on the artist's circle will shoot out even more smaller data objects that display the song name along with the amount of times it had been streamed that week. There will also be a link to to listen to the song available on the circle. The circle size will be determined based on its number of streams.

## Functionality & MVP

In datafy, users will be able to:
- [ ] Interact with each data object by clicking with their mouse.
- [ ] Be able to clearly read the data that is available on each circle
- [ ] Be able to click on the link to listen to the song on spotify once they have reaced the end of the data tree (user will have to login to their own spotify though).

The data objects will:
- [ ] Vary in size as follows: Monthly circles will be the same size, artist circles will vary in size based on their position on the chart for that week, song circles will vary in size based on the amount of streams the song received for that week.
- [ ] Vary in color and be connected to their child circles via a line segment.
- [ ] Each will circle will contain its relevant data that is clearly readable.
The main page will also include:
- [ ] A title and short explanation of the project.
- [ ] Links to my github and to the source of where I got my data (spotifycharts.com)

## Wireframes

This app will consist of a single screen with a canvas displaying the objects in the center (wide screened), and a title and short explanation above it. The links to my github and the source data will be underneath the canvas.

The canvas will start out with 6 main circles and each click on a specific circle will allow that circle to shoot out smaller circles of relative size. All circles will have a single line connecting them back to their parent circle.

![example wire-frame](https://github.com/nmatison/datafy/blob/master/images/final-wire-frame.png)

###Need to keep in mind/look into: 
Room will be an issue. The canvas will either have to be "enlarged" or other parent circles will have to close if a parent circle is selected. Could possibly shrink all circles when a parent expands by a fixed percentage. This would give the illusion that the canvas is enlarging.


## Architecture and Technologies

Datafy will use the following technologies:

+ `D3.js` will be used for the overall structure and canvas logic.
+ `HTML5` canvas for the rendering
+ `CSS` to help with the page layout

The project will also include the data files from [Spotify Charts](https://spotifycharts.com/regional/global/weekly/2018-08-10--2018-08-17) in csv form.


## Implementation Timeline

### Over the weekend:
- [x] Grab all necessary data from Spotify Charts.
- [x] Repo and `github` setup. Have a temp `node.js` server setup for easier testing.
- [x] Play around with the csv data using `d3` and become accustomed to how it is used.
- [ ] Begin researching more into `d3` and engaging in tutorials that will assist in leading me in the right direction.

### Day1:
- [ ] Finish walking through `d3` tutorials/readings.
- [ ] Have the overall `html` structure (Title, Description, Canvas, and Links) set up.
- [ ] Start the implmentation of the `canvas` with what was learned above. Get at least one parent circle rendering.
- [ ] Get necessary data rendering on the parent circle.

### Day2:
- [ ] Finish all of the parent circles
- [ ] Get the `click handler` working properly to generate child circles.
- [ ] Have children circle sizes(artist circles) display size based on their position on the charts.

### Day3:
- [ ] Have the correct data displaying on each circle.
- [ ] Already figured out the click handler and the sizing, so rinse and repeat for the songs circles (children of the artist circles)
- [ ] Have song circles display size based on the percentage of streams they have of the total streams for all songs.

 ### Day4: 
 - [ ] Have the correct data displaying on 100% of circles
 - [ ] Have the screen sizing issue resolved as noted under the WireFrame Section above.
 - [ ] Have everything properly styled on the `html` sheet.


## Bonus Features

- [ ] Alter the starting circles to start as one large circle with all the data in it. On click, this will burst into category circles: artists, week dates, categories. Have those circles break out into smaller categories based on their overall stream rates over the past six months.
- [ ] Do a user login with Spotify's api. This would allow for the app to pull data from the user's profile and specific live information regarding artists and their songs. This would open up a whole world of possibilities including:
+ live stats for the song's stream count
+ personalized data for a user's playlist and songs (most played songs, favorite category, favorite album, etc).
+ comparison of personalized user data and overall Spotify data.
