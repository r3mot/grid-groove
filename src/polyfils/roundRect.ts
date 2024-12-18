// Polyfill for `roundRect`

if (
  process.env.NODE_ENV === 'test' &&
  !CanvasRenderingContext2D.prototype.roundRect
) {
  CanvasRenderingContext2D.prototype.roundRect = function (
    _x,
    _y,
    _width,
    _height,
    radii,
  ) {
    if (arguments.length < 4) {
      throw new TypeError(
        `Failed to execute 'roundRect' on 'CanvasRenderingContext2D': 4 arguments required, but only ${arguments.length} present.`,
      )
    }

    if (Array.isArray(radii) && (radii.length === 0 || radii.length > 4)) {
      throw new TypeError(
        `Failed to execute 'roundRect' on 'CanvasRenderingContext2D': Between 1 and 4 radii are required.`,
      )
    }
    // console.log("roundRect called with:", { _x, _y, _width, _height, radii });
  }
}
