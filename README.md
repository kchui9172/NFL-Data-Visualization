# midterm-hackathon15

My project was visualizing data regarding the ranking of NFL teams in 2014. The data was taken from http://www.espn.com/sportsnation/teamrankings. In the study, teams were ranked based on 25 criteria that fans most wanted in return for the "emotion, money, and time" invested into the sport. After surveying over 100,000 fans, a weighted average based on fans' preference was calculated to form each team's score. You can see how the teams are ranked based on different criteria, from overall rank to coaching or stadium experience. More detailed instructions are on the page.

If running locally, download folder, and in folder run, python -m http.server. See page on localhost:8000

WebGL topics I used:
- creating 3D geometry
- camera movement
- translation
- animation (rotation)
- scaling 
- applying texture
- point source lighting 

How to Navigate:
- r = turn cube rotation on/off (default = off)
- i = move camera in
- j = move camera left
- k = move camera right
- m = move camera out
- up arrow = move camera up
- down arrow = move camera down
- s = reset to original view

Things to improve in the future:
- have checkboxs to mark which ranking methods want to use rather than key values
- import data rather than using string
- allow ranking based on multiple criteria 
- add WebGL text for clearer labeling
- list team rankings based on critera on html page so can clearly see team ranking rather than just relative size of cubes
- add CSS to make page more aesthetically pleasing

Notes:
- I loaded the data as a JSON string as I wasn't sure how to asychronously deal with loading data from a local file
- Loading the textures currently hard coded, would change to for loop if given more time 