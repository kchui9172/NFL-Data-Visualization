var canvas;
var gl;


//Buffers
var vertexBuffer, indexBuffer, normalBuffer;

//Matrices
var projectionMatrix, viewMatrix, modelMatrix, normalMatrix;
var projectionMatrixLoc, viewMatrixLoc, modelMatrixLoc;

//Viewing:
var fov;

window.onload = function init(){
  //create a canvas
  canvas = document.getElementById('gl-canvas');
  gl = canvas.getContext('experimental-webgl');
  if ( !gl ) { 
  	alert( "WebGL isn't available" );
  }

  //Set up shaders
  initializeShaders();

  //Set up buffers
  initializeBuffers();

  //initializeTextures();

  fov = 45;
  projectionMatrix = perspective(fov, canvas.width/canvas.height, 1, 100);
  viewMatrix = translate(0,0,-20);


  render();
}

function initializeShaders(){
   //Load shaders and initialize attribute buffers
   program = initShaders(gl, "shader-vs", "shader-fs");
   gl.useProgram(program);

   //Find uniforms in vertex shader
   projectionMatrixLoc = gl.getUniformLocation(program, "Pmatrix");
   viewMatrixLoc = gl.getUniformLocation(program, "Vmatrix");
   modelMatrixLoc = gl.getUniformLocation(program, "Mmatrix");
}

function initializeBuffers(){
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

  // Create and store data into vertex buffer
  vertexBuffer = gl.createBuffer ();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  /*cubeVerticesTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                gl.STATIC_DRAW);*/

  normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

  indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

}

function render(){
	gl.depthFunc(gl.LEQUAL);
	gl.enable(gl.DEPTH_TEST); //enable z buffer
	gl.clearColor(0.0, 0.0, 0.0, 1.0); //clear to black 
	gl.clearDepth(1.0);
	gl.viewport(0.0, 0.0, canvas.width, canvas.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//Set projection and view matrix
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
	gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(viewMatrix));

	//Bind vertices to position variable in vertex shader - need to rebind because drawing orthographic projection
	//requires binding psoition attribute to different buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	var _position = gl.getAttribLocation(program, "position");
	gl.vertexAttribPointer(_position, 3, gl.FLOAT, false,0,0);
	gl.enableVertexAttribArray(_position); 

	/*gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	var normalAttribute = gl.getAttribLocation(program, "normal");
	gl.vertexAttribPointer(normalAttribute, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(normalAttribute);*/

	modelMatrix = mat4();
	gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(modelMatrix));

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

	//Draw cube
	gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);


}