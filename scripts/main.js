// Create an image element
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');
var img    = document.createElement('IMG');
var width  = canvas.width;
var height = canvas.height;
var radius = 10;

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
  drawPlayer(ctx,width/2-radius,height/2-radius);

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
}

