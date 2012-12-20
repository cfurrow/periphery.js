// Create an image element
var canvas = document.getElementById('c');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx    = canvas.getContext('2d');
var img    = document.createElement('IMG');
var width  = canvas.width;
var height = canvas.height;
var radius = 10;
var playerX;
var playerY;
var playerDirection = (90*Math.PI)/180;
playerX = width/2-radius;
playerY = height/2-radius;


function drawPlayer(ctx,x,y,direction){
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

  drawPeripheryVision(ctx,x,y,direction);
  drawCentralVision(ctx,x,y,direction);
}

function solveASA(angle1,side,angle2){
  // Solve the triangle to get S
  var a,b,c; // sides
  var A,B,C; // angles
  c = side;
  A = angle1 * Math.PI / 180;// half of the visual field
  B = angle2 * Math.PI / 180;
  C = (180-(angle1+angle2)) * Math.PI / 180; 

  // law of sines => a/sin(A) = b/sin(B) = c/sin(C)
  // c/sin(C) = y/sin(60) = 300/sin(60) = 150*sqrt(3)
  // 150*sqrt(3) = a/sin(A) 
  // 150*sqrt(3) = a/sin(30) 
  // 150*sqrt(3) * sin(30) = a
  // 150*sqrt(3) * sin(30) = 129.904
  a = (c/Math.sin(C)) * Math.sin(A);
  b = Math.sin(B) * (a/Math.sin(A));
  return {
    A:A,
    B:B,
    C:C,
    a:a,
    b:b,
    c:c
  };
}
function drawPeripheryVision(ctx,x,y,direction){
  var triangle = solveASA(50,y,90);
  var linearVisionLength = triangle.a;
  var distanceToFarWall  = ctx.canvas.width - x*Math.cos(direction); // D
  ctx.beginPath();

  ctx.strokeStyle = "#dddddd";
  ctx.fillStyle = "#dddddd";
  ctx.moveTo(x,y);
  // need to create a triangle, using the angle to determine 
  // how far to move the x from playerX to the left, and right
  ctx.lineTo(x-linearVisionLength/2,10);
  ctx.lineTo(x+linearVisionLength/2,10);
  ctx.lineTo(x,y);

  ctx.closePath();
  ctx.fill();
}
function drawCentralVision(ctx,x,y,direction) {
  // V = 2arctan(S/2D)
  // V = 2 * (cos(S/2D)/sin(S/2D))
  // V/2 = cos(S/2D)/sin(S/2D)
  // V = visual angle
  // S = frontal extent linear distance (what?)
  // D = Distance from observer to the viewing object

  var triangle = solveASA(30,y,90);

  var linearVisionLength = triangle.a;
  var distanceToFarWall  = ctx.canvas.width - x; // D
  ctx.beginPath();

  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#ffffff";
  ctx.moveTo(x,y);
  // need to create a triangle, using the angle to determine 
  // how far to move the x from playerX to the left, and right
  ctx.lineTo((x-linearVisionLength/2),10);
  ctx.lineTo((x+linearVisionLength/2),10);
  ctx.lineTo(x,y);

  ctx.closePath();
  ctx.fill();
}

document.onkeydown = function(e){
  if(e.which == 38){
    //up
    playerY -=5;
    return false;
  }
  else if(e.which == 40){
    //down
    playerY +=5;
    return false;
  }
  else if(e.which == 37 ){
    //left
    //playerX -=5;
    playerDirection += (5*Math.PI/180);
    return false;
  }
  else if(e.which == 39 ){
    //right
    playerDirection -= (5*Math.PI/180);
    return false;
  }
}

function main(){
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
  drawPlayer(ctx,playerX,playerY,playerDirection);
}

setInterval(main,100);

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
  //drawPlayer(ctx,playerX,playerY);
}

// Specify the src to load the image
//img.src = "http://i.imgur.com/gwlPu.jpg";
