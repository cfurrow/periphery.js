// Create an image element
var FPS = 30;
var canvas    = document.getElementById('c');
canvas.width  = window.innerWidth;
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
  visionRadius: canvas.width*2,
  radius:radius,
  velocity:5,
  turningLeft:false,
  turningRight:false,
  movingForward:false,
  movingBack:false
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
  ctx.beginPath();

  ctx.strokeStyle = "#dddddd";
  ctx.fillStyle = "#dddddd";

  ctx.moveTo(player.x,player.y);

  var trianglePointX = player.x + player.visionRadius*Math.cos(player.direction - (50*Math.PI/180));
  var trianglePointY = player.y + player.visionRadius*Math.sin(player.direction - (50*Math.PI/180));

  ctx.lineTo(trianglePointX,trianglePointY);

  trianglePointX = player.x + player.visionRadius*Math.cos(player.direction + (50*Math.PI/180));
  trianglePointY = player.y + player.visionRadius*Math.sin(player.direction + (50*Math.PI/180));

  ctx.lineTo(trianglePointX,trianglePointY);
  ctx.lineTo(player.x,player.y);

  ctx.closePath();
  ctx.fill();
}

function drawCentralVision(ctx,player) {
  var x = player.x;
  var y = player.y;
  var direction = player.direction;

  ctx.beginPath();

  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#ffffff";
  ctx.moveTo(x,y);

  var trianglePointX = player.x + player.visionRadius*Math.cos(player.direction - (15*Math.PI/180));
  var trianglePointY = player.y + player.visionRadius*Math.sin(player.direction - (15*Math.PI/180));

  ctx.lineTo(trianglePointX,trianglePointY);

  trianglePointX = player.x + player.visionRadius*Math.cos(player.direction + (15*Math.PI/180));
  trianglePointY = player.y + player.visionRadius*Math.sin(player.direction + (15*Math.PI/180));
  ctx.lineTo(trianglePointX,trianglePointY);
  ctx.lineTo(x,y);

  ctx.closePath();
  ctx.fill();
}

document.onkeydown = function(e){
  var movement=false;
  if(e.which == 38){
    player.movingForward=true;
    movement=true;
  }
  if(e.which == 40){
    player.movingBack=true;
    movement=true;
  }
  if(e.which == 37 ){
    player.turningLeft=true;
    movement=true;
  }
  if(e.which == 39 ){
    player.turningRight=true;
    movement=true;
  }
  return !movement; // don't bubble event
}
document.onkeyup = function(e){
  if(e.which == 38){
    player.movingForward=false;
  }
  if(e.which==40){
    player.movingBack=false;
  }
  if(e.which==37){
    player.turningLeft=false;
  }
  if(e.which==39){
    player.turningRight=false;
  }
  return false; // don't bubble event
}

var requestAnimationFrame = window.requestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            function(func) { setTimeout(func, 1000 / FPS); }
function handleMovement(player) {
  if(player.movingForward){
    player.y += player.velocity * Math.sin(player.direction);
    player.x += player.velocity * Math.cos(player.direction);
  }
  if(player.movingBack){
    player.y -= player.velocity * Math.sin(player.direction);
    player.x -= player.velocity * Math.cos(player.direction);
  }
  if(player.turningRight){
    player.direction += (5*Math.PI/180);
  }
  if(player.turningLeft){
    player.direction -= (5*Math.PI/180);
  }
  player.x = (player.x-player.radius) < 0 ? player.radius : player.x;
  player.x = (player.x+player.radius) > ctx.canvas.width ? ctx.canvas.width-player.radius : player.x;
  player.y = (player.y-player.radius) < 0 ? player.radius : player.y;
  player.y = (player.y+player.radius) > ctx.canvas.height ? ctx.canvas.height-player.radius : player.y;
}
function frame(){
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
  handleMovement(player);
  drawPlayer(ctx,player);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);


