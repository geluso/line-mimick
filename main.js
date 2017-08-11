var BUCKET_SIZE = 1;

var ACTUAL_COORDS = [];
var GENERATED_COORDS = [];
var RECORDING = false;

var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.width = window.innerWidth;
ctx.height = window.innerHeight;

document.addEventListener("mousedown", startRecording);
document.addEventListener("mousemove", stillRecording);
document.addEventListener("mouseup", stopRecording);
document.addEventListener("mouseout", stopRecording);

document.addEventListener("touchstart", startRecording);
document.addEventListener("touchmove", stillRecording);
document.addEventListener("touchend", stopRecording);
document.addEventListener("touchcancel", stopRecording);

function startRecording(ev) {
  RECORDING = true;
  if (ev.touches !== undefined) {
    ev = ev.touches[0];
  }
  ACTUAL_COORDS.push({x: Math.round(ev.pageX), y: Math.round(ev.pageY)});
}

function stillRecording(ev) {
  if (ev.touches !== undefined) {
    ev = ev.touches[0];
  }
  if(RECORDING) {
    ACTUAL_COORDS.push({x: Math.round(ev.pageX), y: Math.round(ev.pageY)});
    if (ACTUAL_COORDS.length > 1) {
      drawPath(ctx, [ACTUAL_COORDS[ACTUAL_COORDS.length - 2], ACTUAL_COORDS[ACTUAL_COORDS.length - 1]], "white");
    }
  }
};

function key(value, bucketSize) {
  bucketSize = bucketSize || BUCKET_SIZE || 1;
  return Math.floor(value / bucketSize) * bucketSize;
}

function drawPath(ctx, path, color="black") {
  if (!path || path.length < 2) {
    return;
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  
  for (var i = 0; i < path.length - 1; i++) {
    var p0 = path[i];
    var p1 = path[i + 1];
    ctx.lineTo(p1.x, p1.y);
  };
  ctx.stroke();
}

function generateMap() {
  var x = {};
  var y = {};
  var map = {x: x, y: y};
  
  for (var i = 2; i < ACTUAL_COORDS.length; i++) {
    var p0 = ACTUAL_COORDS[i - 2];
    var p1 = ACTUAL_COORDS[i - 1];
    var p2 = ACTUAL_COORDS[i];
    
    var dx1 = p1.x - p0.x;
    var dx2 = p2.x - p1.x;
    
    var dy1 = p1.y - p0.y;
    var dy2 = p2.y - p1.y;
    
    if (map.x[dx1] === undefined) {
      map.x[dx1] = [];
    }
    if (map.y[dy1] === undefined) {
      map.y[dy1] = [];
    }
    
    map.x[dx1].push(dx2);
    map.y[dy1].push(dy2);
  }
  return map;
}

function generateXYDependentMap() {
  // map[dx1][dy1].push({x:dx2,y:dy2})
  var map = {};
  
  for (var i = 2; i < ACTUAL_COORDS.length; i++) {
    var p0 = ACTUAL_COORDS[i - 2];
    var p1 = ACTUAL_COORDS[i - 1];
    var p2 = ACTUAL_COORDS[i];
    
    var dx1 = p1.x - p0.x;
    var dx2 = p2.x - p1.x;
    
    var dy1 = p1.y - p0.y;
    var dy2 = p2.y - p1.y;
    
    if (map[dx1] === undefined) {
      map[dx1] = {};
    }
    if (map[dx1][dy1] === undefined) {
      map[dx1][dy1] = [];
    }
    
    map[dx1][dy1].push({x: dx2, y: dy2});
  }
  return map;
}

function generateCoords(path) {
  if (path.length < 2) {
    return;
  }

  // var getMap = generateMap;
  var getMap = generateXYDependentMap;
  var map = getMap();
  var coords = [];
  var dx = path[1].x - path[0].x;
  var dy = path[1].y - path[0].y;
  
  var xx = ACTUAL_COORDS[0].x;
  var yy = ACTUAL_COORDS[0].y;
  
  while (dx != undefined && dy != undefined && coords.length < 12 * path.length) {
    coords.push({x: xx, y: yy});
    var x_values, y_values;
    if (getMap === generateMap) {
      x_values = map.x[dx];
      y_values = map.y[dy];
      if (x_values === undefined || y_values === undefined) {
        break;
      } else {
        var x_val = x_values[Math.floor(Math.random() * x_values.length)];
        var y_val = y_values[Math.floor(Math.random() * y_values.length)];
        xx += x_val;
        yy += y_val;
        dx = x_val;
        dy = y_val;
      }
    } else {
      if (map[dx] === undefined || map[dx][dy] === undefined) {
        break;
      }
      values = map[dx][dy];
      val = values[Math.floor(Math.random() * values.length)];
      xx += val.x;
      yy += val.y;
      dx = val.x;
      dy = val.y;
    }
  }
  
  return coords;
}

function stopRecording() {
  if (!RECORDING) {
    return;
  }
  var mode = "derivitive rainbow";
  mode = "repeat rainbow";
  if (mode === "derivitive rainbow") {
    var generatedCoords = generateCoords(ACTUAL_COORDS);
    drawPath(ctx, generatedCoords, "violet");
    generatedCoords = generateCoords(generatedCoords);
    drawPath(ctx, generatedCoords, "indigo");
    generatedCoords = generateCoords(generatedCoords);
    drawPath(ctx, generatedCoords, "blue");
    generatedCoords = generateCoords(generatedCoords);
    drawPath(ctx, generatedCoords, "green");
    generatedCoords = generateCoords(generatedCoords);
    drawPath(ctx, generatedCoords, "yellow");
    generatedCoords = generateCoords(generatedCoords);
    drawPath(ctx, generatedCoords, "orange");
    generatedCoords = generateCoords(generatedCoords);
    drawPath(ctx, generatedCoords, "red");
    drawPath(ctx, ACTUAL_COORDS, "white");
  } else if (mode === "repeat rainbow") {
    var generatedCoords = generateCoords(ACTUAL_COORDS);
    drawPath(ctx, generatedCoords, "violet");
    generatedCoords = generateCoords(ACTUAL_COORDS);
    drawPath(ctx, generatedCoords, "indigo");
    generatedCoords = generateCoords(ACTUAL_COORDS);
    drawPath(ctx, generatedCoords, "blue");
    generatedCoords = generateCoords(ACTUAL_COORDS);
    drawPath(ctx, generatedCoords, "green");
    generatedCoords = generateCoords(ACTUAL_COORDS);
    drawPath(ctx, generatedCoords, "yellow");
    generatedCoords = generateCoords(ACTUAL_COORDS);
    drawPath(ctx, generatedCoords, "orange");
    generatedCoords = generateCoords(ACTUAL_COORDS);
    drawPath(ctx, generatedCoords, "red");
    drawPath(ctx, ACTUAL_COORDS, "white");
  } else {
    drawPath(ctx, ACTUAL_COORDS, "white");
    var generatedCoords = generateCoords(ACTUAL_COORDS);
    drawPath(ctx, generatedCoords, "yellow");
    var generatedCoords = generateCoords(ACTUAL_COORDS);
    drawPath(ctx, generatedCoords, "yellow");
    var generatedCoords = generateCoords(ACTUAL_COORDS);
    drawPath(ctx, generatedCoords, "yellow");
    var generatedCoords = generateCoords(ACTUAL_COORDS);
    drawPath(ctx, generatedCoords, "yellow");
    var generatedCoords = generateCoords(ACTUAL_COORDS);
    drawPath(ctx, generatedCoords, "yellow");
    var generatedCoords = generateCoords(ACTUAL_COORDS);
    drawPath(ctx, generatedCoords, "yellow");
    var generatedCoords = generateCoords(ACTUAL_COORDS);
    drawPath(ctx, generatedCoords, "yellow");
  }
  
  RECORDING = false;
  ACTUAL_COORDS = [];
  GENERATED_COORDS = [];
}

document.getElementById("clear").addEventListener("click", clearCanvas);

function clearCanvas() {
  ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.width = window.innerWidth;
  ctx.height = window.innerHeight;
}
