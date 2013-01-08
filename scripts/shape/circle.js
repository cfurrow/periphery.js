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
Circle.prototype    = new Shape();
