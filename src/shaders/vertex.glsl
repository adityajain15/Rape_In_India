precision mediump float;
attribute float sourceX;
attribute float sourceY;
attribute float targetX;
attribute float targetY;
attribute float elapsed;
attribute float duration;

uniform float stageWidth;
uniform float stageHeight;
uniform float pointWidth;
uniform bool isMobile;

// Credits to Peter Beshai
vec2 normalizeCoords(float x, float y) {
  return vec2(
  2.0 * ((x / stageWidth) - 0.5),
  // invert y to treat [0,0] as bottom left in pixel space
  -(2.0 * ((y / stageHeight) - 0.5)));
}

float easeCubicInOut(float t) {
  t *= 2.0;
  t = (t <= 1.0 ? t * t * t : (t -= 2.0) * t * t + 2.0) / 2.0;
  if (t > 1.0) {
    t = 1.0;
  }
  return t;
}

float linear (float t) {
  if (t > 1.0) {
    t = 1.0;
  }
  return t;
}

void main () {
  gl_PointSize = pointWidth;
  float yt;
  float xt;
  if (elapsed < 0.0) {
    yt = 0.0;
    xt = 0.0;
  } else {
    yt = isMobile ? linear(elapsed / duration) : easeCubicInOut(elapsed / duration);
    xt = isMobile ? easeCubicInOut(elapsed / duration) : linear(elapsed / duration);
  }

  float currentX = mix(sourceX, targetX, xt);
  float currentY = mix(sourceY, targetY, yt);

  gl_Position = vec4(normalizeCoords(currentX, currentY), 0, 1);
}