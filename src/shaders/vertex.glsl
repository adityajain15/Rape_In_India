precision mediump float;
attribute vec2 position;

uniform float stageWidth;
uniform float stageHeight;

// Credits to Peter Beshai
vec2 normalizeCoords(vec2 position) {
  // read in the positions into x and y vars
  float x = position[0];
  float y = position[1];

  return vec2(
  2.0 * ((x / stageWidth) - 0.5),
  // invert y to treat [0,0] as bottom left in pixel space
  -(2.0 * ((y / stageHeight) - 0.5)));
}

void main () {
  gl_PointSize = 0.8;
  gl_Position = vec4(normalizeCoords(position), 0, 1);
}