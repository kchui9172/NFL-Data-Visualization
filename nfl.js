//Variables
var canvas;
var gl;
var currentlyPressedKeys = {};

//Geometry related 
var vertex_buffer;
var index_buffer;
var normal_buffer;

//Color related
var cubeColor;
var cube1Texture, cube2Texture;
var cube1Image, cube2Image;
var textureCoordAttribute;
var normalAttribute;

//Model view and projection matrices
var _Pmatrix;
var _Vmatrix;
var _Mmatrix;
var mo_matrix;
var proj_matrix;
var view_matrix;

var rotateCubes;
var fov;

//Preset translation, scale, and rotation axis for each cube 
var xMove = [-40,-30,-20,-10,10,20,30, 40,-40,-30,-20,-10,10,20,30, 40,-40,-30,-20,-10,10,20,30, 40,-40,-30,-20,-10,10,20,30, 40];
var yMove = [20,20,20,20,20,20,20,20,10,10,10,10,10,10,10,10,-10,-10,-10,-10,-10,-10,-10,-10,-20,-20,-20,-20,-20,-20,-20,-20];
var zMove = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var scaleVals = new Array(32);

var prevTime = 0;
var prevRot = 0;

var teamNames = ["Arizona Cardinals","Atlanta Falcons","Baltimore Ravens", "Buffalo Bills",
"Carolina Panthers", "Chicago Bears", "Cincinnati Bengals", "Cleveland Browns","Dallas Cowboys",
"Denver Broncos", "Detroit Lions", "Green Bay Packers", "Houston Texans", "Indianapolis Colts",
"Jacksonville Jaguars","Kansas City Chiefs","Miami Dolphins", "Minnesota Vikings",
"New England Patriots", "New Orleans Saints", "New York Giants", "New York Jets", "Oakland Raiders",
"Philadelphia Eagles","Pittsburgh Steelers","San Diego Chargers","San Francisco 49ers","Seattle Seahawks",
"St. Louis Rams", "Tampa Bay Buccaneers","Tennessee Titans", "Washington Redskins"];

var data ={
   "Seattle Seahawks": {
      "RNK": 3,
      "BNG": 3,
      "FRL": 11,
      "OWN": 5,
      "AFF": 69,
      "STX": 13,
      "PLA": 3,
      "CCH": 5,
      "TTR": 8,
      "NUM": 20
   },
   "Green Bay Packers": {
      "RNK": 8,
      "BNG": 55,
      "FRL": 7,
      "OWN": 4,
      "AFF": 20,
      "STX": 3,
      "PLA": 9,
      "CCH": 25,
      "TTR": 2,
      "NUM": 24
   },
   "Indianapolis Colts": {
      "RNK": 13,
      "BNG": 19,
      "FRL": 25,
      "OWN": 57,
      "AFF": 36,
      "STX": 17,
      "PLA": 15,
      "CCH": 21,
      "TTR": 19,
      "NUM": 14
   },
   "New Orleans Saints": {
      "RNK": 14,
      "BNG": 29,
      "FRL": 22,
      "OWN": 24,
      "AFF": 38,
      "STX": 38,
      "PLA": 13,
      "CCH": 4,
      "TTR": 10,
      "NUM": 30
   },
   "Denver Broncos": {
      "RNK": 17,
      "BNG": 5,
      "FRL": 53,
      "OWN": 19,
      "AFF": 73,
      "STX": 57,
      "PLA": 27,
      "CCH": 43,
      "TTR": 30,
      "NUM": 6
   },
   "Carolina Panthers": {
      "RNK": 26,
      "BNG": 4,
      "FRL": 58,
      "OWN": 62,
      "AFF": 56,
      "STX": 78,
      "PLA": 43,
      "CCH": 51,
      "TTR": 57,
      "NUM": 31
   },
   "San Francisco 49ers": {
      "RNK": 27,
      "BNG": 10,
      "FRL": 76,
      "OWN": 36,
      "AFF": 86,
      "STX": 59,
      "PLA": 19,
      "CCH": 8,
      "TTR": 26,
      "NUM": 23
   },
   "Baltimore Ravens": {
      "RNK": 36,
      "BNG": 63,
      "FRL": 57,
      "OWN": 11,
      "AFF": 48,
      "STX": 33,
      "PLA": 26,
      "CCH": 19,
      "TTR": 5,
      "NUM": 9
   },
   "Pittsburgh Steelers": {
      "RNK": 38,
      "BNG": 69,
      "FRL": 37,
      "OWN": 7,
      "AFF": 49,
      "STX": 56,
      "PLA": 30,
      "CCH": 36,
      "TTR": 8,
      "NUM": 8
   },
   "New England Patriots": {
      "RNK": 43,
      "BNG": 44,
      "FRL": 51,
      "OWN": 31,
      "AFF": 99,
      "STX": 61,
      "PLA": 16,
      "CCH": 2,
      "TTR": 17,
      "NUM": 0
   },
   "Jacksonville Jaguars": {
      "RNK": 44,
      "BNG": 113,
      "FRL": 24,
      "OWN": 28,
      "AFF": 2,
      "STX": 19,
      "PLA": 47,
      "CCH": 12,
      "TTR": 60,
      "NUM": 15
   },
   "Kansas City Chiefs": {
      "RNK": 56,
      "BNG": 30,
      "FRL": 79,
      "OWN": 47,
      "AFF": 70,
      "STX": 49,
      "PLA": 65,
      "CCH": 24,
      "TTR": 86,
      "NUM": 4
   },
   "Arizona Cardinals": {
      "RNK": 58,
      "BNG": 40,
      "FRL": 85,
      "OWN": 68,
      "AFF": 57,
      "STX": 63,
      "PLA": 54,
      "CCH": 27,
      "TTR": 73,
      "NUM": 21
   },
   "Atlanta Falcons": {
      "RNK": 67,
      "BNG": 82,
      "FRL": 67,
      "OWN": 33,
      "AFF": 66,
      "STX": 95,
      "PLA": 69,
      "CCH": 60,
      "TTR": 70,
      "NUM": 28
   },
   "Philadelphia Eagles": {
      "RNK": 69,
      "BNG": 67,
      "FRL": 77,
      "OWN": 55,
      "AFF": 93,
      "STX": 89,
      "PLA": 58,
      "CCH": 29,
      "TTR": 77,
      "NUM": 19
   },
   "Houston Texans": {
      "RNK": 72,
      "BNG": 108,
      "FRL": 48,
      "OWN": 38,
      "AFF": 89,
      "STX": 55,
      "PLA": 57,
      "CCH": 77,
      "TTR": 69,
      "NUM": 12
   },
   "Chicago Bears": {
      "RNK": 77,
      "BNG": 81,
      "FRL": 78,
      "OWN": 58,
      "AFF": 108,
      "STX": 98,
      "PLA": 56,
      "CCH": 53,
      "TTR": 49,
      "NUM": 27
   },
   "New York Giants": {
      "RNK": 79,
      "BNG": 94,
      "FRL": 82,
      "OWN": 34,
      "AFF": 113,
      "STX": 101,
      "PLA": 71,
      "CCH": 23,
      "TTR": 15,
      "NUM": 17
   },
   "Buffalo Bills": {
      "RNK": 82,
      "BNG": 68,
      "FRL": 92,
      "OWN": 96,
      "AFF": 12,
      "STX": 106,
      "PLA": 86,
      "CCH": 77,
      "TTR": 102,
      "NUM": 2
   },
   "Tampa Bay Buccaneers": {
      "RNK": 84,
      "BNG": 92,
      "FRL": 100,
      "OWN": 82,
      "AFF": 79,
      "STX": 86,
      "PLA": 95,
      "CCH": 41,
      "TTR": 37,
      "NUM": 29
   },
   "St. Louis Rams": {
      "RNK": 88,
      "BNG": 73,
      "FRL": 96,
      "OWN": 113,
      "AFF": 74,
      "STX": 116,
      "PLA": 84,
      "CCH": 32,
      "TTR": 40,
      "NUM": 22
   },
   "Cincinnati Bengals": {
      "RNK": 99,
      "BNG": 15,
      "FRL": 118,
      "OWN": 110,
      "AFF": 91,
      "STX": 110,
      "PLA": 88,
      "CCH": 95,
      "TTR": 110,
      "NUM": 10
   },
   "San Diego Chargers": {
      "RNK": 100,
      "BNG": 47,
      "FRL": 95,
      "OWN": 106,
      "AFF": 102,
      "STX": 120,
      "PLA": 77,
      "CCH": 56,
      "TTR": 90,
      "NUM": 7
   },
   "Minnesota Vikings": {
      "RNK": 103,
      "BNG": 84,
      "FRL": 101,
      "OWN": 85,
      "AFF": 88,
      "STX": 113,
      "PLA": 79,
      "CCH": 67,
      "TTR": 102,
      "NUM": 26
   },
   "Tennessee Titans": {
      "RNK": 104,
      "BNG": 61,
      "FRL": 108,
      "OWN": 102,
      "AFF": 78,
      "STX": 103,
      "PLA": 106,
      "CCH": 83,
      "TTR": 98,
      "NUM": 13
   },
   "Dallas Cowboys": {
      "RNK": 107,
      "BNG": 100,
      "FRL": 109,
      "OWN": 92,
      "AFF": 112,
      "STX": 69,
      "PLA": 108,
      "CCH": 112,
      "TTR": 48,
      "NUM": 16
   },
   "Miami Dolphins": {
      "RNK": 108,
      "BNG": 53,
      "FRL": 121,
      "OWN": 99,
      "AFF": 94,
      "STX": 111,
      "PLA": 112,
      "CCH": 107,
      "TTR": 90,
      "NUM": 1
   },
   "Washington Redskins": {
      "RNK": 109,
      "BNG": 116,
      "FRL": 105,
      "OWN": 88,
      "AFF": 111,
      "STX": 112,
      "PLA": 96,
      "CCH": 99,
      "TTR": 54,
      "NUM": 18
   },
   "Cleveland Browns": {
      "RNK": 110,
      "BNG": 95,
      "FRL": 115,
      "OWN": 111,
      "AFF": 72,
      "STX": 104,
      "PLA": 104,
      "CCH": 96,
      "TTR": 111,
      "NUM": 11
   },
   "Detroit Lions": {
      "RNK": 111,
      "BNG": 70,
      "FRL": 120,
      "OWN": 84,
      "AFF": 98,
      "STX": 97,
      "PLA": 113,
      "CCH": 100,
      "TTR": 120,
      "NUM": 25
   },
   "New York Jets": {
      "RNK": 113,
      "BNG": 97,
      "FRL": 110,
      "OWN": 93,
      "AFF": 117,
      "STX": 105,
      "PLA": 100,
      "CCH": 44,
      "TTR": 105,
      "NUM": 3
   },
   "Oakland Raiders": {
      "RNK": 119,
      "BNG": 109,
      "FRL": 111,
      "OWN": 115,
      "AFF": 83,
      "STX": 121,
      "PLA": 114,
      "CCH": 109,
      "TTR": 56,
      "NUM": 5
   }
};

var ranking = new Array(32);
var sortedTeams = new Array(32);

window.onload = function init(){
  //create a canvas
  canvas = document.getElementById('my_Canvas');
  gl = canvas.getContext('experimental-webgl');
  if ( !gl ) { alert( "WebGL isn't available" ); }

  processData();

  //set buffers
  initializeBuffers();

  //set shaders
  initializeShaders();

  initializeTextures();

  //Set orthographic projection of cross hair to be initially off
  rotateCubes = false;

  //Initial Matrices
  fov = 50;
  proj_matrix = perspective(fov,canvas.width/canvas.height,1, 100);
  view_matrix = translate(0,0,-60);

  //Handle keyboard inputs 
  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;
  render(); 
}

function processData(){
  for (var i = 0; i < 32; i++){
  	var team = teamNames[i];
  	ranking[parseInt(data[team]["NUM"])] = parseInt(data[team]["RNK"]);
  }
  sortRanks();
}

function sortRanks(){
	var temp = ranking;
	var initValue = 4.2;
	  for (var j = 0; j < 32; j++){
		var index = 0;
		var value = 10000;
		for (var i = 0; i < temp.length; i++) {
			if (temp[i] < value) {
				value = temp[i];
				index = i;
			}
		}
		temp[index] = 100000;
		sortedTeams[j] = index;
		scaleVals[j] = initValue;
		initValue -= .1;
	  }
}


//Function to initialize shaders 
function initializeShaders(){
   //Load shaders and initialize attribute buffers
   program = initShaders(gl, "shader-vs", "shader-fs");
   gl.useProgram(program);

   //Associate attributes to vertex shader
   _Pmatrix = gl.getUniformLocation(program, "Pmatrix");
   _Vmatrix = gl.getUniformLocation(program, "Vmatrix");
   _Mmatrix = gl.getUniformLocation(program, "Mmatrix");

   //NEW
   _Nmatrix = gl.getUniformLocation(program, "normalMatrix");
   //directionVecLoc = gl.getUniformLocation(program,"directionalVector");

   //Bind vertext buffer with position attribute 
   gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
   var _position = gl.getAttribLocation(program, "position");
   gl.vertexAttribPointer(_position, 3, gl.FLOAT, false,0,0);
   gl.enableVertexAttribArray(_position); 

   textureCoordAttribute = gl.getAttribLocation(program, "aTextureCoord");
   gl.enableVertexAttribArray(textureCoordAttribute);

   //NEW
   normalAttribute = gl.getAttribLocation(program, "normal");
   gl.enableVertexAttribArray(normalAttribute);
}


function initializeBuffers(){
  //Define and store geometry
  //var vertices = [-2,2,2, -2,-2,2, 2,2,2, 2,-2,2, 
  //  -2,2,-2, -2,-2,-2, 2,2,-2, 2,-2,-2 ];

  var vertices = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0
  ];

  var normals = [
    // Front
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
    
    // Back
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
    
    // Top
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
    
    // Bottom
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
    
    // Right
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
    
    // Left
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0
  ];

  var textureCoordinates = [
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Back
    //0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    0,0,
    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Right
    //0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    0,0,
    // Left
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0
  ];

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23    // left
  ];

  //indices = [2,0,1,5,3,7,6,5,4,0,6,2,3,1];

  //Edges defined for white outline of cubes 
  /*edges = [0,1, 1,3, 3,2, 2,0, 
  2,6, 6,7, 7,3, 4,6, 4,5, 5,7, 0,4, 1,5];*/

  //Make 8 color arrays so that each cube is a different color 
  var colorChoices = [[0.3,1,1], [0,0,1]];


  //Generate color matrix for each color
  cubeColor = Array(2);
  for (var i = 0; i < 2; i++){
    cubeColor[i] = fillColorArray(colorChoices[i]);
  }

  // Create and store data into vertex buffer
  vertex_buffer = gl.createBuffer ();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  cubeVerticesTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                gl.STATIC_DRAW);

  normal_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

  index_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
}

//Function to create color matrix for each cube 
function fillColorArray(c){
  var temp = c;
  for (var i = 0; i < 23; i++){
    c = c.concat(temp);
  }
  return c;
}
  

var imageFiles = ["texans.jpg", "vikings.jpg"];
var textures = [];
var images = [];


function createImages(){
  console.log("what");
  for (var i = 0; i <2 ;i++){
    var im = new Image();
    im.onload = function(){
      console.log("wha");
      images.push(im);      
    }
    im.src = imageFiles[i];
  }
}


function initializeTextures(){
  //AFC East
  t1 = gl.createTexture();
  i1 = new Image();
  i1.onload = function() { handleTextureLoaded(i1, t1); }
  i1.src = "patriots.jpg";
  textures.push(t1);

  t2 = gl.createTexture();
  i2 = new Image();
  i2.onload = function() { handleTextureLoaded(i2, t2); }
  i2.src = "dolphins.jpg";
  textures.push(t2);

  t3 = gl.createTexture();
  i3 = new Image();
  i3.onload = function() { handleTextureLoaded(i3, t3); }
  i3.src = "bills.png";
  textures.push(t3);

  t4 = gl.createTexture();
  i4 = new Image();
  i4.onload = function() { handleTextureLoaded(i4, t4); }
  i4.src = "jets.png";
  textures.push(t4);

  //AFC West
  t5 = gl.createTexture();
  i5 = new Image();
  i5.onload = function() { handleTextureLoaded(i5, t5); }
  i5.src = "chiefs.jpg";
  textures.push(t5);

  t6 = gl.createTexture();
  i6 = new Image();
  i6.onload = function() { handleTextureLoaded(i6, t6); }
  i6.src = "raiders.jpeg";
  textures.push(t6);

  t7 = gl.createTexture();
  i7 = new Image();
  i7.onload = function() { handleTextureLoaded(i7, t7); }
  i7.src = "broncos.jpg";
  textures.push(t7);

  t8 = gl.createTexture();
  i8 = new Image();
  i8.onload = function() { handleTextureLoaded(i8, t8); }
  i8.src = "chargers.jpg";
  textures.push(t8);

  //AFC North
  t9 = gl.createTexture();
  i9 = new Image();
  i9.onload = function() { handleTextureLoaded(i9, t9); }
  i9.src = "steelers.jpg";
  textures.push(t9);

  t10 = gl.createTexture();
  i10 = new Image();
  i10.onload = function() { handleTextureLoaded(i10, t10); }
  i10.src = "ravens.jpeg";
  textures.push(t10);

  t11 = gl.createTexture();
  i11 = new Image();
  i11.onload = function() { handleTextureLoaded(i11, t11); }
  i11.src = "bengals.png";
  textures.push(t11);

  t12 = gl.createTexture();
  i12 = new Image();
  i12.onload = function() { handleTextureLoaded(i12, t12); }
  i12.src = "browns.png";
  textures.push(t12);

  //AFC South
  t13 = gl.createTexture();
  i13 = new Image();
  i13.onload = function() { handleTextureLoaded(i13, t13); }
  i13.src = "texans.jpg";
  textures.push(t13);

  t14 = gl.createTexture();
  i14 = new Image();
  i14.onload = function() { handleTextureLoaded(i14, t14); }
  i14.src = "titans.jpg";
  textures.push(t14);

  t15 = gl.createTexture();
  i15 = new Image();
  i15.onload = function() { handleTextureLoaded(i15, t15); }
  i15.src = "colts.jpeg";
  textures.push(t15);

  t16 = gl.createTexture();
  i16 = new Image();
  i16.onload = function() { handleTextureLoaded(i16, t16); }
  i16.src = "jaguars.jpeg";
  textures.push(t16);

  //NFC East
  t17 = gl.createTexture();
  i17 = new Image();
  i17.onload = function() { handleTextureLoaded(i17, t17); }
  i17.src = "cowboys.jpg";
  textures.push(t17);

  t18 = gl.createTexture();
  i18 = new Image();
  i18.onload = function() { handleTextureLoaded(i18, t18); }
  i18.src = "giants.png";
  textures.push(t18);

  t19 = gl.createTexture();
  i19 = new Image();
  i19.onload = function() { handleTextureLoaded(i19, t19); }
  i19.src = "redskins.jpg";
  textures.push(t19);

  t20 = gl.createTexture();
  i20 = new Image();
  i20.onload = function() { handleTextureLoaded(i20, t20); }
  i20.src = "eagles.png";
  textures.push(t20);

  //NFC West
  t21 = gl.createTexture();
  i21 = new Image();
  i21.onload = function() { handleTextureLoaded(i21, t21); }
  i21.src = "seahawks.jpg";
  textures.push(t21);

  t22 = gl.createTexture();
  i22 = new Image();
  i22.onload = function() { handleTextureLoaded(i22, t22); }
  i22.src = "cardinals.png";
  textures.push(t22);

  t23 = gl.createTexture();
  i23 = new Image();
  i23.onload = function() { handleTextureLoaded(i23, t23); }
  i23.src = "rams.png";
  textures.push(t23);

  t24 = gl.createTexture();
  i24 = new Image();
  i24.onload = function() { handleTextureLoaded(i24, t24); }
  i24.src = "49ers.png";
  textures.push(t24);

  //NFC North
  t25 = gl.createTexture();
  i25 = new Image();
  i25.onload = function() { handleTextureLoaded(i25, t25); }
  i25.src = "greenbay.png";
  textures.push(t25);

  t26 = gl.createTexture();
  i26 = new Image();
  i26.onload = function() { handleTextureLoaded(i26, t26); }
  i26.src = "lions.png";
  textures.push(t26);

  t27 = gl.createTexture();
  i27 = new Image();
  i27.onload = function() { handleTextureLoaded(i27, t27); }
  i27.src = "vikings.jpg";
  textures.push(t27);

  t28 = gl.createTexture();
  i28 = new Image();
  i28.onload = function() { handleTextureLoaded(i28, t28); }
  i28.src = "bears.png";
  textures.push(t28);

  //NFC South
  t29 = gl.createTexture();
  i29 = new Image();
  i29.onload = function() { handleTextureLoaded(i29, t29); }
  i29.src = "falcons.jpg";
  textures.push(t29);

  t30 = gl.createTexture();
  i30 = new Image();
  i30.onload = function() { handleTextureLoaded(i30, t30); }
  i30.src = "bucs.jpg";
  textures.push(t30);

  t31 = gl.createTexture();
  i31 = new Image();
  i31.onload = function() { handleTextureLoaded(i31, t31); }
  i31.src = "saints.jpg";
  textures.push(t31);

  t32 = gl.createTexture();
  i32 = new Image();
  i32.onload = function() { handleTextureLoaded(i32, t32); }
  i32.src = "panthers.jpg";
  textures.push(t32);
}

function handleTextureLoaded(image, texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
}

//Function to handle all keyboard inputs
function handleKeyDown(event){
  currentlyPressedKeys[event.keyCode] = true;
  /*-------------CAMERA MOVEMENT-------------------*/
  //move forward
  if (String.fromCharCode(event.keyCode) == "I"){
    view_matrix = mult(translate(0,0,1),view_matrix);
  }
  //move left
  else if (String.fromCharCode(event.keyCode) == "J"){
    view_matrix = mult(translate(1,0,0),view_matrix);
  }
  //move right
  else if (String.fromCharCode(event.keyCode) == "K"){
    view_matrix = mult(translate(-1,0,0),view_matrix);
  }
  //move back
  else if (String.fromCharCode(event.keyCode) == "M"){
    view_matrix = mult(translate(0,0,-1),view_matrix);
  }
  //turn rotation on or off
  else if (String.fromCharCode(event.keyCode) == "R"){
    rotateCubes = !rotateCubes;
    console.log(rotateCubes);
  }
  //reset to original view 
  else if (String.fromCharCode(event.keyCode) == "S"){
	fov = 50;
	proj_matrix = perspective(fov,canvas.width/canvas.height,1, 100);
	view_matrix = translate(0,0,-50);	
  }
  //move up
  else if (event.keyCode == '38'){
    view_matrix = mult(view_matrix, translate(0,-.25,0));
  }
  //move down
  else if (event.keyCode == '40'){
    view_matrix = mult(view_matrix, translate(0,.25,0));
  }
  else{
    return;
  }
}

function handleKeyUp(event) {
  currentlyPressedKeys[event.keyCode] = false;
}

function findRank(pos){
	for (var i = 0; i < 32; i++){
		if (sortedTeams[i] == pos){
			return i;
		}
	}
}

//Function for drawing
function render(){
  rotateMatrix = mat4();
  animate(new Date().getTime());
}

function animate(time){
      //Prepare canvas
      gl.depthFunc(gl.LEQUAL);
      gl.enable(gl.DEPTH_TEST); //enable z buffer
      gl.clearColor(0.0, 0.0, 0.0, 1.0); //clear to black 
      gl.clearDepth(1.0);
      gl.viewport(0.0, 0.0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      //Set projection and view matrix
      gl.uniformMatrix4fv(_Pmatrix, false, flatten(proj_matrix));
      gl.uniformMatrix4fv(_Vmatrix, false, flatten(view_matrix));

      //Bind vertices to position variable in vertex shader - need to rebind because drawing orthographic projection
      //requires binding psoition attribute to different buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
      var _position = gl.getAttribLocation(program, "position");
      gl.vertexAttribPointer(_position, 3, gl.FLOAT, false,0,0);
      gl.enableVertexAttribArray(_position); 

      gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
      gl.vertexAttribPointer(normalAttribute, 3, gl.FLOAT, false, 0, 0);

       //Loop through each cube
      for (var i = 0; i < 32; i++){    
        /*----------- Draw cube ----------------*/ 
        var trans = translate(xMove[i],yMove[i],zMove[i]);

        //rotate cubes
        if (rotateCubes){
          var currTime = new Date().getTime();
          //Find time that has passed since last rendering
          var progress = currTime - prevTime;
          prevTime = currTime;

          //calculate number of degrees to rotate since last rendering
          if ( i == 0){ //first cube rotates at 20 RPM
            var degreesRotated = progress * 0.12;
          }
          else{ //second cube rotates at 30 RPM
            var degreesRotated = progress * 0.18;  
          }
          rotDeg = degreesRotated + prevRot;

          var rotateMatrix = rotate(prevRot, [0,1,0]);
          prevRot = rotDeg;
        }

        mo_matrix = mat4();

        //Set model matrix to be product of translation, scaling, and rotation 
        mo_matrix = mult(mo_matrix, trans);

        //Need to find size to scale
        var s = findRank(i);

        mo_matrix = mult(mo_matrix, scalem(scaleVals[s],scaleVals[s],scaleVals[s]));

        if (rotateCubes){
          mo_matrix = mult(mo_matrix, rotateMatrix);  
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);
        gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
        gl.activeTexture(gl.TEXTURE0);

        //CHANGE THIS 
        gl.bindTexture(gl.TEXTURE_2D, textures[i]);
        gl.uniform1i(gl.getUniformLocation(program, "uSampler"), 0);

        gl.uniformMatrix3fv(_Nmatrix , false, flatten(toMat3(transpose(inverse(mo_matrix)))));

        //Bind _Mmatrix uniform value in vertex shader to mo_matrix
        gl.uniformMatrix4fv(_Mmatrix, false, flatten(mo_matrix));
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);

        //Draw cube
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
      }
      requestAnimFrame( animate );
}