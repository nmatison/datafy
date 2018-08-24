# datafy

## Background and Overview

Datafy is a data visualization project that takes weekly Spotify data from the most recent six months, and display it as an interactive form.

Users will open the page to circles representing each month's worth of data. Clicking on a circle will result in a chain of info becoming available through more circle objects:
+ Clicking on one month will shoot out smaller data objects that represents the top artists whose songs made it in the top 25 songs on the top 200 chart for that week. The top 200 is determined by the number of streams a song received that week. Each circle's size being relative to the artist's position on the charts for that week.
+ Clicking on the artist's circle will shoot out even more smaller data objects that display the song name along with the amount of times it had been streamed that week. The song circles will also be linked to the specific song on Spotify so users will be able to instantly listen to the song.


## Architecture and Technologies

Datafy will use the following technologies:

+ `D3.js` will be used for the overall structure and svg logic.
+ `HTML5` for the basic structure
+ `CSS` to help with the page layout

The project will also include the data files from [Spotify Charts](https://spotifycharts.com/regional/global/weekly/2018-08-10--2018-08-17) in csv form.

## Bonus Features

- [ ] Alter the starting circles to start as one large circle with all the data in it. On click, this will burst into category circles: artists, week dates, categories. Have those circles break out into smaller categories based on their overall stream rates over the past six months.
- [ ] Do a user login with Spotify's api. This would allow for the app to pull data from the user's profile and specific live information regarding artists and their songs. This would open up a whole world of possibilities including:
+ live stats for the song's stream count
+ personalized data for a user's playlist and songs (most played songs, favorite category, favorite album, etc).
+ comparison of personalized user data and overall Spotify data.
