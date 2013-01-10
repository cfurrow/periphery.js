/*global Shape:false ctx:false illuminated: false*/
var Vec2            = illuminated.Vec2;
var DiscObject      = illuminated.DiscObject;
var Circle          = Circle || {};

Circle   = function(x,y,r,fill){
  Shape.apply(this,arguments);
  this.radius    = r;
  this.fillStyle = fill;
  this.center    = new Vec2(this.x,this.y);

  //illuminate.js
  var disc = new DiscObject({ 
    center: new Vec2(this.x, this.y),
    radius: this.radius 
  });

  this.contains = disc.contains;
  this.cast     = disc.cast;
  this.points   = disc.points;
  this.path     = disc.path;

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
Circle.prototype    = new Shape();
