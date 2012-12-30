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

var Shape = function(px,py){
  this.x = px;
  this.y = py;
  this.draw = function(){};
};

var Rectangle = function(x,y,w,h,fill){
  Shape.apply(this,arguments);
  this.width  = w;
  this.height = h;
  this.fillStyle = fill;

  this.draw = function(player){
    ctx.fillStyle = this.fillStyle;
    ctx.fillRect(this.x,this.y,this.width,this.height);
  };
};
var Circle   = function(x,y,r,fill){
  Shape.apply(this,arguments);
  this.radius    = r;
  this.fillStyle = fill;

  this.draw = function(player){
    ctx.save();
    ctx.fillStyle = this.fillStyle;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };
};
Rectangle.prototype = new Shape();
Circle.prototype   = new Shape();

scene.push(new Rectangle(10,10,50,50,'rgb(255,0,0)'));
scene.push(new Rectangle(400,400,30,30,'rgb(0,255,0)'));
scene.push(new Rectangle(500,10,90,90,'rgb(0,0,255)'));
scene.push(new Circle(90,300,30,'rgb(255,100,0)'));

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

  //ctx.globalCompositeOperation = 'desination-over';
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

  ctx.globalCompositeOperation = 'xor';
  drawPeripheryVision(ctx,player);

  ctx.save();
  ctx.globalCompositeOperation = 'xor';
  drawCentralVision(ctx,player);
  ctx.restore();
}

function drawPeripheryVision(ctx,player){
  ctx.beginPath();

  ctx.fillStyle = "rgba(20,20,20,0.9)";
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
  ctx.clip();
}

function drawCentralVision(ctx,player) {
  ctx.beginPath();

  ctx.fillStyle = "rgba(200,200,200,0.9)";
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
    scene[i].draw(player);
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

function frame(){
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

  handleMovement(player);

  ctx.save();
  ctx.globalCompositeOperation = 'destination-over';
  drawPlayer(ctx,player);
  drawScene(player);
  ctx.restore();

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

