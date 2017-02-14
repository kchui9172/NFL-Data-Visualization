# midterm-hackathon15

My project was visualizing data regarding the ranking of NFL teams in 2014. The data was taken from http://www.espn.com/sportsnation/teamrankings. In the study, teams were ranked based on 25 criteria that fans most wanted in return for the "emotion, money, and time" invested into the sport. After surveying over 100,000 fans, a weighted average based on fan's preference was calculated to form each team's score. 

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

Notes:
- I loaded the data as a JSON string as I wasn't sure how to asychronously deal with loading data from a local file
- Loading the textures currently hard coded, would change to for loop if given more time 