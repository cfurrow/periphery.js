/*global illuminated: false*/
var Vec2            = illuminated.Vec2;
var RectangleObject = illuminated.RectangleObject;

var Shape = function(px,py){
  this.x = px;
  this.y = py;
  this.draw = function(){};
  
  //illuminate.js
  var rect = new RectangleObject({ 
    topleft: new Vec2(this.x, this.y), 
    bottomright: new Vec2(this.x+this.width, this.y+this.height) 
  });
  this._forEachVisibleEdges = rect._forEachVisibleEdges;
  this.inBound              = rect.inBound;
  this._forEachVisibleEdges = rect._forEachVisibleEdges;
  this.contains = rect.contains;
  this.cast     = rect.cast;
  this.path     = rect.path;
};
