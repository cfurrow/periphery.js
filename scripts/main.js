// Create an image element
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');
var img    = document.createElement('IMG');
var width  = canvas.width;
var height = canvas.height;
var radius = 10;
var playerX;
var playerY;
playerX = width/2-radius;
playerY = height/2-radius;

// When the image is loaded, draw it
// Pulled from: http://blog.teamtreehouse.com/create-vector-masks-using-the-html5-canvas
img.onload = function () {
  // Save the state, so we can undo the clipping
  ctx.save();   
  // Create a shape, of some sort
  ctx.beginPath();
  ctx.moveTo(10, 10);
  ctx.lineTo(100, 30);
  ctx.lineTo(180, 10);
  ctx.lineTo(200, 60);
  ctx.arcTo(180, 70, 120, 0, 10);
  ctx.lineTo(200, 180);
  ctx.lineTo(100, 150);
  ctx.lineTo(70, 180);
  ctx.lineTo(20, 130);
  ctx.lineTo(50, 70);
  ctx.closePath();
  // Clip to the current path
  ctx.clip();
  ctx.drawImage(img, 0, 0);
  // Undo the clipping
  ctx.restore();
  drawPlayer(ctx,playerX,playerY);
}

// Specify the src to load the image
img.src = "http://i.imgur.com/gwlPu.jpg";

function drawPlayer(ctx,x,y){
  ctx.beginPath();
  ctx.fillStyle = "#ffffff";
  ctx.arc(x,y, radius+2, 0, Math.PI*2, false);
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.fillStyle = "#5e9fd2";
  ctx.arc(x,y, radius, 0, Math.PI*2, false);
  ctx.fill();
  ctx.closePath();

  drawCentralVision(ctx,x,y);
}

function drawCentralVision(ctx,x,y) {
  // V = 2arctan(S/2D)
  // V = 2 * (cos(S/2D)/sin(S/2D))
  // V/2 = cos(S/2D)/sin(S/2D)
  // V = visual angle
  // S = frontal extent linear distance (what?)
  // D = Distance from observer to the viewing object
  // Solve the triangle to get S
  var a,b,c;
  var A,B,C;
  c = y;
  A = 60;
  B = 90;
  C = 30; // half of the visual field

  // law of sines => a/sin(A) = b/sin(B) = c/sin(C)
  a = c/Math.sin(C);
  b = Math.sin(B) * a;

  var linearVisionLength = a;
  var distanceToFarWall  = ctx.canvas.width - x; // D
  ctx.beginPath();

  ctx.strokeStyle = "#ffffff";
  ctx.moveTo(x,y);
  // need to create a triangle, using the angle to determine 
  // how far to move the x from playerX to the left, and right
  ctx.lineTo(x-linearVisionLength/2,0);
  ctx.lineTo(x+linearVisionLength/2,0);
  ctx.lineTo(x,y);

  ctx.stroke();
  ctx.closePath();
}

document.onkeydown = function(e){
  console.log(e);
  if(e.which == 38){
    //up
    playerY -=5;
  }
  else if(e.which == 40){
    //down
    playerY +=5;
  }
  else if(e.which == 37 ){
    //left
    playerX -=5;
  }
  else if(e.which == 39 ){
    //right
    playerX +=5;
  }
  return false;
}

function main(){
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
  drawPlayer(ctx,playerX,playerY);
}

setInterval(main,60);
