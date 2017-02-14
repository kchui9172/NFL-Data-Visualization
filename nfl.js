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
var xMove = [-20,-15,-10,-5,5,10,15,20,-20,-15,-10,-5,5,10,15,20,-20,-15,-10,-5,5,10,15,20,-20,-15,-10,-5,5,10,15,20]
var yMove = [10,10,10,10,10,10,10,10,5,5,5,5,5,5,5,5,-5,-5,-5,-5,-5,-5,-5,-5,-10,-10,-10,-10,-10,-10,-10,-10];
var zMove = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var xAxis = [0,0];
var yAxis = [1,1];
var zAxis = [0,0];

var prevTime = 0;
var prevRot = 0;

window.onload = function init(){
  //create a canvas
  canvas = document.getElementById('my_Canvas');
  gl = canvas.getContext('experimental-webgl');
  if ( !gl ) { alert( "WebGL isn't available" ); }

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
  view_matrix = translate(0,0,-50);

  //Handle keyboard inputs 
  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;
  render(); 
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


/*function createImages(){
  console.log("what");
  for (var i = 0; i <2 ;i++){
    var im = new Image();
    im.onload = function(){
      console.log("wha");
      images.push(im);      
    }
    im.src = imageFiles[i];
  }
}*/


function initializeTextures(){

  /*for (var i = 0; i <2; i++){
    textures[i] = gl.createTexture();
    image = new Image();
    image.onload = function(){
      //handleTextureLoaded(textures[i].image, textures[i]);
      gl.bindTexture(gl.TEXTURE_2D, textures[i]);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.bindTexture(gl.TEXTURE_2D,null);
    }
    image.src = imageFiles[i];
  }*/

  /*createImages();

  for (var ii = 0; ii < 2; ++ii) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
 
    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
 
    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[ii]);
 
    // add the texture to the array of textures.
    textures.push(texture);
  }*/


  cube1Texture = gl.createTexture();
  cube1Image = new Image();
  cube1Image.onload = function() { handleTextureLoaded(cube1Image, cube1Texture); }
  cube1Image.src = "texans.jpg";

  cube2Texture = gl.createTexture();
  cube2Image = new Image();
  cube2Image.onload = function() { handleTextureLoaded(cube2Image, cube2Texture); }
  cube2Image.src ="vikings.jpg";

  textures.push(cube1Texture);
  textures.push(cube2Texture);

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


      

        //Set model matrix to be product of translation, scaling, and rotation 
        mo_matrix = mat4();
        mo_matrix = mult(mo_matrix, trans);

        if (rotateCubes){
          mo_matrix = mult(mo_matrix, rotateMatrix);  
        }
        //mo_matrix = mult(mo_matrix, rotateMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);
        gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
        gl.activeTexture(gl.TEXTURE0);

        //CHANGE THIS 
        gl.bindTexture(gl.TEXTURE_2D, textures[0]);
        gl.uniform1i(gl.getUniformLocation(program, "uSampler"), 0);

        //NEW

        gl.uniformMatrix3fv(_Nmatrix , false, flatten(toMat3(transpose(inverse(mo_matrix)))));

        //Bind _Mmatrix uniform value in vertex shader to mo_matrix
        gl.uniformMatrix4fv(_Mmatrix, false, flatten(mo_matrix));
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);

        //Draw cube
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
      }
      requestAnimFrame( animate );
}