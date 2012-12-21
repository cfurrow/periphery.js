// Create an image element
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');
var img    = document.createElement('IMG');
var radius = 10;
var FPS    = 60;
var width  = 0;
var height = 0;
var scene  = []
var fillWindow = fillWindow === false ? false : true;

if(fillWindow){
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
width         = canvas.width;
height        = canvas.height;

var player = {
  x:width/2-radius, 
  y:height/2-radius, 
  direction:deg2rad(191),
  visionRadius: canvas.width*2,
  radius:radius,
  velocity:3,
  turningLeft:false,
  turningRight:false,
  movingForward:false,
  movingBack:false,
  periphery:[[0,0],[0,0],[0,0]],
  central:  [[0,0],[0,0],[0,0]]
};

scene.push({
  x: 10,
  y: 10,
  width: 50,
  height: 50,
  fillStyle: 'rgb(255,0,0)',
  draw:function(){
    ctx.fillStyle = this.fillStyle;
    ctx.fillRect(this.x,this.y,this.width,this.height);
  }
});
scene.push({
  x: 400,
  y: 400,
  width: 30,
  height: 30,
  fillStyle: 'rgb(0,255,0)',
  draw:function(){
    ctx.fillStyle = this.fillStyle;
    ctx.fillRect(this.x,this.y,this.width,this.height);
  }
});

function deg2rad(degree) {
  return degree * Math.PI / 180;
}
function rad2deg(radian){
  return radian * (180/Math.PI);
}

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


function drawPeripheryVision(ctx,player){
  ctx.save();
  ctx.beginPath();

  ctx.fillStyle = "rgba(240,240,240,0.1)";
  player.periphery = [];

  ctx.moveTo(player.x,player.y);
  player.periphery.push(player.x,player.y);

  var trianglePointX = player.x + player.visionRadius*Math.cos(player.direction - deg2rad(50));
  var trianglePointY = player.y + player.visionRadius*Math.sin(player.direction - deg2rad(50));

  ctx.lineTo(trianglePointX,trianglePointY);
  player.periphery.push([trianglePointX,trianglePointY]);

  trianglePointX = player.x + player.visionRadius*Math.cos(player.direction + deg2rad(50));
  trianglePointY = player.y + player.visionRadius*Math.sin(player.direction + deg2rad(50));

  ctx.lineTo(trianglePointX,trianglePointY);
  player.periphery.push([trianglePointX,trianglePointY]);

  ctx.lineTo(player.x,player.y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawCentralVision(ctx,player) {
  ctx.beginPath();

  ctx.fillStyle = "rgba(200,200,200,0.1)";
  ctx.moveTo(player.x,player.y);

  player.central = [];
  player.central.push([player.x,player.y]);

  var trianglePointX = player.x + player.visionRadius * Math.cos(player.direction - deg2rad(15));
  var trianglePointY = player.y + player.visionRadius * Math.sin(player.direction - deg2rad(15));

  ctx.lineTo(trianglePointX,trianglePointY);
  player.central.push([trianglePointX,trianglePointY]);

  trianglePointX = player.x + player.visionRadius * Math.cos(player.direction + deg2rad(15));
  trianglePointY = player.y + player.visionRadius * Math.sin(player.direction + deg2rad(15));
  ctx.lineTo(trianglePointX,trianglePointY);
  player.central.push([trianglePointX,trianglePointY]);

  ctx.lineTo(player.x,player.y);

  ctx.closePath();
  ctx.fill();
  ctx.clip();
}

function drawScene(player){
  var i = 0;
  var len = scene.length;
  for(;i<len;i++){
    if(playerCanSee(player,scene[i])){
      scene[i].draw();
    }
  }
}

document.onkeydown = function(e){
  var movement=false;
  if(e.which == 38){
    player.movingForward = true;
    player.movingBack    = false;
    movement=true;
  }
  if(e.which == 40){
    player.movingBack    = true;
    player.movingForward = false;
    movement=true;
  }
  if(e.which == 37 ){
    player.turningLeft   = true;
    player.turningRight  = false;
    movement=true;
  }
  if(e.which == 39 ){
    player.turningRight  = true;
    player.turningLeft   = false;
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
    player.turningLeft  = false;
  }
  if(e.which==39){
    player.turningRight = false;
  }
  return false; // don't bubble event
}

window.onresize = function(){
  if(fillWindow){
    canvas.height = window.innerHeight;
    canvas.width  = window.innerWidth; 
    width  = canvas.width;
    height = canvas.height;
    player.visionRadius = canvas.width*2;
  }
}

var requestAnimationFrame = window.requestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            function(func) { setTimeout(func, 1000 / FPS); }

function handleMovement(player) {
  if(player.movingForward){
    player.y += player.velocity * 2.5 * Math.sin(player.direction);
    player.x += player.velocity * 2.5 * Math.cos(player.direction);
  }
  if(player.movingBack){
    player.y -= player.velocity * 2.5 * Math.sin(player.direction);
    player.x -= player.velocity * 2.5 * Math.cos(player.direction);
  }
  if(player.turningRight){
    player.direction += deg2rad(player.velocity);
  }
  if(player.turningLeft){
    player.direction -= deg2rad(player.velocity);
  }
  player.x = (player.x-player.radius) < 0 ? player.radius : player.x;
  player.x = (player.x+player.radius) > ctx.canvas.width ? ctx.canvas.width-player.radius : player.x;
  player.y = (player.y-player.radius) < 0 ? player.radius : player.y;
  player.y = (player.y+player.radius) > ctx.canvas.height ? ctx.canvas.height-player.radius : player.y;
}

function playerCanSee(player,obj){
  // determine if the object is within the player.central or player.periphery triangles
  return true;
}

function frame(){
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

  handleMovement(player);

  ctx.save();
  drawPlayer(ctx,player);
  drawScene(player);
  ctx.restore();

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);


