/*global deg2rad:false rad2deg:false Rectangle:false Circle:false MovingCircle:false illuminated:false*/
/*laxcomma*/
var canvas        = document.getElementById('c');
var ctx           = canvas.getContext('2d');
var img           = document.createElement('IMG');
var playerRadius        = 10;
var FPS           = 60;
var width         = 0;
var height        = 0;
var scene         = [];
var fillWindow    = fillWindow === false ? false : true;
var enableShadows = false;
// Illuminated code
var Vec2            = illuminated.Vec2;
var Lamp            = illuminated.Lamp;
var Lighting        = illuminated.Lighting;
var lighting        = null;

if(fillWindow){
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

width         = canvas.width;
height        = canvas.height;

var player = {
  x:width/2-playerRadius, 
  y:height/2-playerRadius, 
  direction:deg2rad(191),
  visionRadius: canvas.width*2,
  radius:playerRadius,
  velocity:3,
  turningLeft:false,
  turningRight:false,
  movingForward:false,
  movingBack:false,
  periphery:[[0,0],[0,0],[0,0]],
  central:  [[0,0],[0,0],[0,0]],
  light: new Lamp({
    position: new Vec2(200, 150),
    distance: 300,
    radius: 1,
    samples: 50
  })
};


scene.push(new Rectangle(10,10,50,50,'rgb(255,0,0)'));
scene.push(new Rectangle(400,400,30,30,'rgb(0,255,0)'));
scene.push(new Rectangle(500,10,90,90,'rgb(0,0,255)'));
scene.push(new Circle(90,300,30,'rgb(255,100,0)'));
scene.push(new MovingCircle(90,300,30,'rgb(10,200,250)'));

function distanceToClosestWallX(x,direction)
{
  if( deg2rad(direction) > 0 && deg2rad(direction) < deg2rad(90) ){
    return ctx.canvas.width;
  }
  if( deg2rad(direction) > 270 && deg2rad(direction) < deg2rad(360)){
    return ctx.canvas.width;
  }
  if( deg2rad(direction) > 90 && deg2rad(direction) < deg2rad(270) ){
    return 0;
  }
  return x;
}

function distanceToClosestWallY(y,direction){
  if( deg2rad(direction) > deg2rad(235) && deg2rad(direction) < deg2rad(315)){
    return 0;
  }
  if( deg2rad(direction) > 45 && deg2rad(direction) < deg2rad(135)) {
    return ctx.canvas.height;
  }
  return y;
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

function drawPlayer(ctx,player){
  var x = player.x;
  var y = player.y;
  var direction = player.direction;

  ctx.beginPath();
  ctx.fillStyle = "#ffffff";
  ctx.arc(x,y, playerRadius+2, 0, Math.PI*2, false);
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.fillStyle = "#5e9fd2";
  ctx.arc(x,y, playerRadius, 0, Math.PI*2, false);
  ctx.fill();
  ctx.closePath();

  ctx.globalCompositeOperation = 'xor';
  drawPeripheryVision(ctx,player);

  ctx.save();
  ctx.globalCompositeOperation = 'xor';
  drawCentralVision(ctx,player);
  ctx.restore();
}

function drawScene(player){
  var i = 0;
  var len = scene.length;
  for(;i<len;i++){
    scene[i].draw();
  }
}

document.onkeydown = function(e){
  var movement=false;
  if(e.which === 38){
    player.movingForward = true;
    player.movingBack    = false;
    movement=true;
  }
  if(e.which === 40){
    player.movingBack    = true;
    player.movingForward = false;
    movement=true;
  }
  if(e.which === 37 ){
    player.turningLeft   = true;
    player.turningRight  = false;
    movement=true;
  }
  if(e.which === 39 ){
    player.turningRight  = true;
    player.turningLeft   = false;
    movement=true;
  }
  return !movement; // don't bubble event
};

document.onkeyup = function(e){
  if(e.which === 38){
    player.movingForward=false;
  }
  if(e.which === 40){
    player.movingBack=false;
  }
  if(e.which === 37){
    player.turningLeft  = false;
  }
  if(e.which === 39){
    player.turningRight = false;
  }
  if(e.which === 83){ // S
    enableShadows = !enableShadows;
  }
  return false; // don't bubble event
};

window.onresize = function(){
  if(fillWindow){
    canvas.height = window.innerHeight;
    canvas.width  = window.innerWidth; 
    width  = canvas.width;
    height = canvas.height;
    player.visionRadius = canvas.width*2;
  }
};


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
    if(player.direction > deg2rad(360)){
      player.direction = 0;
    }
  }
  if(player.turningLeft){
    player.direction -= deg2rad(player.velocity);
    if(player.direction < deg2rad(0)){
      player.direction = deg2rad(360);
    }
  }
  player.x = (player.x-player.radius) < 0 ? player.radius : player.x;
  player.x = (player.x+player.radius) > ctx.canvas.width ? ctx.canvas.width-player.radius : player.x;
  player.y = (player.y-player.radius) < 0 ? player.radius : player.y;
  player.y = (player.y+player.radius) > ctx.canvas.height ? ctx.canvas.height-player.radius : player.y;
  player.light.position = new Vec2(player.x,player.y);
}

var requestAnimationFrame = window.requestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            function(func) { setTimeout(func, 1000 / FPS); };
function frame(){
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

  handleMovement(player);

  ctx.save();
  //ctx.globalCompositeOperation = 'destination-over';
  drawPlayer(ctx,player);
  drawScene(player);
  lighting = new Lighting({
              light: player.light,
              objects: scene
            });
  lighting.compute(canvas.width, canvas.height);
  lighting.render(ctx);

  ctx.restore();

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

