var canvas;
var gl;

window.onload = function init(){
  //create a canvas
  canvas = document.getElementById('gl-canvas');
  gl = canvas.getContext('experimental-webgl');
  if ( !gl ) { 
  	alert( "WebGL isn't available" );
  }
  render();
}

function render(){
	gl.depthFunc(gl.LEQUAL);
	gl.enable(gl.DEPTH_TEST); //enable z buffer
	gl.clearColor(0.0, 0.0, 0.0, 1.0); //clear to black 
	gl.clearDepth(1.0);
	gl.viewport(0.0, 0.0, canvas.width, canvas.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}