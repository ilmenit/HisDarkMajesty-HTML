/**
   * @method _updatePointerPosition
   * @protected
   * @param {Number} id
   * @param {Number} pageX
   * @param {Number} pageY
   **/
  createjs.Stage.prototype._updatePointerPosition = function(id, pageX, pageY) {
    var rect = this._getElementRect(this.canvas);
    var w = this.canvas.width;
    var h = this.canvas.height;

    // CocoonJS Touchfix
    if( isNaN(rect.left)   ) rect.left = 0;
    if( isNaN(rect.top)    ) rect.top = 0;
    if( isNaN(rect.right)  ) rect.right = w;
    if( isNaN(rect.bottom) ) rect.bottom = h;
    // \CocoonJS Touchfix end

    pageX -= rect.left;
    pageY -= rect.top;

    pageX /= (rect.right-rect.left)/w;
    pageY /= (rect.bottom-rect.top)/h;
    var o = this._getPointerData(id);
    if (o.inBounds = (pageX >= 0 && pageY >= 0 && pageX <= w-1 && pageY <= h-1)) {
      o.x = pageX;
      o.y = pageY;
    } else if (this.mouseMoveOutside) {
      o.x = pageX < 0 ? 0 : (pageX > w-1 ? w-1 : pageX);
      o.y = pageY < 0 ? 0 : (pageY > h-1 ? h-1 : pageY);
    }

    o.rawX = pageX;
    o.rawY = pageY;

    if (id == this._primaryPointerID) {
      this.mouseX = o.x;
      this.mouseY = o.y;
      this.mouseInBounds = o.inBounds;
    }
  }