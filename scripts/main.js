// Create an image element
var FPS = 30;
var canvas = document.getElementById('c');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx    = canvas.getContext('2d');
var img    = document.createElement('IMG');
var width  = canvas.width;
var height = canvas.height;
var radius = 10;

var player = {
  x:width/2-radius, 
  y:height/2-radius, 
  direction:90*Math.PI/180, 
  visionRadius: canvas.width+100,
  radius:radius,
  velocity:5
};


function drawPlayer(ctx,player){
  var x = player.x;
  var y = player.y;
  var direction = player.direction;

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

  drawPeripheryVision(ctx,player);
  drawCentralVision(ctx,player);
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

function drawPeripheryVision(ctx,player){
  var x = player.x;
  var y = player.y;
  var direction = player.direction;

  ctx.beginPath();

  ctx.strokeStyle = "#dddddd";
  ctx.fillStyle = "#dddddd";

  ctx.moveTo(x,y);

  var newX = player.x + player.visionRadius*Math.cos(player.direction - (50*Math.PI/180));
  var newY = player.y + player.visionRadius*Math.sin(player.direction - (50*Math.PI/180));

  ctx.lineTo(newX,newY);
  //ctx.lineTo(x-linearVisionLength/2,10);

  newX = player.x + player.visionRadius*Math.cos(player.direction + (50*Math.PI/180));
  newY = player.y + player.visionRadius*Math.sin(player.direction + (50*Math.PI/180));
  ctx.lineTo(newX,newY);
  ctx.lineTo(x,y);

  ctx.closePath();
  ctx.fill();
}

function drawCentralVision(ctx,player) {
  // V = 2arctan(S/2D)
  // V = 2 * (cos(S/2D)/sin(S/2D))
  // V/2 = cos(S/2D)/sin(S/2D)
  // V = visual angle
  // S = frontal extent linear distance (what?)
  // D = Distance from observer to the viewing object
  var x = player.x;
  var y = player.y;
  var direction = player.direction;

  ctx.beginPath();

  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#ffffff";
  ctx.moveTo(x,y);

  var newX = player.x + player.visionRadius*Math.cos(player.direction - (15*Math.PI/180));
  var newY = player.y + player.visionRadius*Math.sin(player.direction - (15*Math.PI/180));

  ctx.lineTo(newX,newY);

  newX = player.x + player.visionRadius*Math.cos(player.direction + (15*Math.PI/180));
  newY = player.y + player.visionRadius*Math.sin(player.direction + (15*Math.PI/180));
  ctx.lineTo(newX,newY);
  ctx.lineTo(x,y);

  ctx.closePath();
  ctx.fill();
}

document.onkeydown = function(e){
  var movement = false;
  if(e.which == 38){
    movement=true;
    //forward
    player.y += player.velocity * Math.sin(player.direction);
    player.x += player.velocity * Math.cos(player.direction);
  }
  else if(e.which == 40){
    movement=true;
    //backward
    player.y -= player.velocity * Math.sin(player.direction);
    player.x -= player.velocity * Math.cos(player.direction);
  }
  else if(e.which == 37 ){
    movement=true;
    //left
    //playerX -=5;
    player.direction += (5*Math.PI/180);
  }
  else if(e.which == 39 ){
    movement=true;
    //right
    player.direction -= (5*Math.PI/180);
  }
  if(movement){
    player.x = (player.x-player.radius) < 0 ? player.radius : player.x;
    player.x = (player.x+player.radus) > ctx.canvas.width ? ctx.canvas.width : player.x;
    player.y = (player.y-player.radius) < 0 ? player.radius : player.y;
    player.y = (player.y+player.radius) > ctx.canvas.height ? ctx.canvas.height : player.y;
    return false; // don't bubble event
  }
}

var requestAnimationFrame = window.requestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            function(func) { setTimeout(func, 1000 / FPS); }
function frame(){
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
  drawPlayer(ctx,player);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

//setInterval(frame,500);

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
}

// Specify the src to load the image
//img.src = "http://i.imgur.com/gwlPu.jpg";
