/*global Shape:false, ctx:false distanceToClosestWallY:false distanceToClosestWallX:false player:false enableShadows:false illuminated:false */
var Rectangle       = Rectangle || {};
var Vec2            = illuminated.Vec2;
var RectangleObject = illuminated.RectangleObject;

Rectangle = function(x,y,w,h,fill){
  Shape.apply(this,arguments);
  this.width     = w;
  this.height    = h;
  this.fillStyle = fill;
  this.enableShadows   = false;

  //illuminate.js
  var rect = new RectangleObject({ 
    topleft: new Vec2(this.x, this.y), 
    bottomright: new Vec2(this.x+this.width, this.y+this.height) 
  });
  this.points = rect.points;


  this.draw = function(){
    ctx.save();
    ctx.fillStyle = this.fillStyle;
    ctx.fillRect(this.x,this.y,this.width,this.height);
    ctx.restore();
  };
};
Rectangle.prototype = new Shape();
