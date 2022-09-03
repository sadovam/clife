document.body.onload = function() {
  const app = {
    size: 20,
    cells: [],
    timer: 0,
    winSize: window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth,
    cellSize: 0,
    max_coord: {
      left: 20,
      right: 0,
      top: 20,
      bottom: 0,
    },
    field: document.getElementById("field"),
    startButton: document.getElementById("start-btn"),
    stopButton: document.getElementById("stop-btn"),
    incButton: document.getElementById("inc-size-btn"),
    decButton: document.getElementById("dec-size-btn"),
  };
  
  app.cellSize = ((app.winSize - 30) / app.size | 0) + "px";
  app.field.style.gridTemplateColumns = `repeat(${app.size}, 1fr)`;
  makeField(app);
  document.getElementById("next-btn").onmousedown = () => changes(app, prepareCell);
  document.getElementById("next-btn").onmouseup = () => {
    changes(app, performCell);
    testIfSizeEnough(app);
  };
  document.getElementById("clear-btn").onclick = () => changes(app, clearCell);
  
  app.incButton.onclick = () => newFieldSize(1, app);
  app.decButton.onclick = () => newFieldSize(-1, app);
  app.startButton.onclick = () => startPlaying(app);
  app.stopButton.onclick = () => stopPlaying(app);
  app.stopButton.disabled = true;
}

function makeField(app) {
  for (let i = 0; i < app.size; i++) {
    let cellsLine = [];
    for (let j = 0; j < app.size; j++) {
      let cell = document.createElement("div");
      cell.style.width = cell.style.height = app.cellSize;
      cell.className = "cell";
      app.field.appendChild(cell);
      cellsLine.push(0);
      cell.onclick = function() { setCell(cell, j, i, app) }; 
    }
    app.cells.push(cellsLine);
  }
}
 
function setCell(cell, x, y, app) {
  cell.classList.toggle("active");
  app.cells[y][x] = app.cells[y][x] != 0 ? 0 : 1;
  testMaxCoords(app, x, y);
}

function testMaxCoords(app, x, y) {
  if (x > app.max_coord.right) app.max_coord.right = x;
  if (x < app.max_coord.left) app.max_coord.left = x;
  if (y > app.max_coord.bottom) app.max_coord.bottom = y;
  if (y < app.max_coord.top) app.max_coord.top = y;
}

function testIfSizeEnough(app) {
  if (app.max_coord.right === app.size-2 || 
    app.max_coord.left === 1 || 
    app.max_coord.top === 1 || 
    app.max_coord.bottom === app.size-2) {
      newFieldSize(1, app);
      app.max_coord.right += 1;
      app.max_coord.left += 1;
      app.max_coord.top += 1;
      app.max_coord.bottom += 1;
    }
}

function nextStep(app) {
  changes(app, prepareCell);
  setTimeout(() => {
    changes(app, performCell);
    testIfSizeEnough(app);
  }, 200);
}

function prepareCell(node, cell, app, i, j) {
  const neighbours = countNeighbours(app.cells, j, i);
  if (cell > 0 && (neighbours > 3 || neighbours < 2)) {
    node.classList.toggle("active");
    node.classList.toggle("dead");
    return 2;
  } 
  if (cell === 0 && neighbours === 3) {
    node.classList.toggle("born");
    testMaxCoords(app, j, i);
    return -2;
  }
  return cell;
}

function performCell(node, cell) {
  if (cell === -2) {
    node.classList.toggle("born");
    node.classList.toggle("active");
    return 1;
  }
  if (cell === 2) {
    node.classList.toggle("dead");
    return 0;
  }
  return cell;
}

function clearCell(node) {
  node.className = "cell";
  return 0;
}


function changes(app, func) {
  let k = 0;
  for (let i = app.max_coord.top-1; i <= app.max_coord.bottom+1; i++) {
    for(let j = app.max_coord.left-1; j <= app.max_coord.right+1; j++) {
      const node = app.field.childNodes[i * app.size + j];
      app.cells[i][j] = func(node, app.cells[i][j], app, i, j);
    }
  }
}

function coordToNum(x, y, width) {
  return y * width + x;
}

function countNeighbours(cells, x, y) {
  let res = 0;
  for (let i = y - 1; i <= y + 1; i++) {
    for(let j = x - 1; j <= x + 1; j++) {
      if(i > 0 && j > 0 && i < cells.length && j < cells[0].length && cells[i][j] > 0) {
        res++;
      }
    }
  }
  return cells[y][x] > 0 ? res - 1 : res;
}

function newFieldSize(delta, app) {
  app.field.innerHTML = '';
  app.size += 2 * delta;
  app.cellSize = ((app.winSize - 30) / app.size | 0) + "px";
  app.field.style.gridTemplateColumns = `repeat(${app.size}, 1fr)`;
  
  if (delta > 0) {
    app.cells.push(Array(app.size-2).fill(0));
    app.cells.unshift(Array(app.size-2).fill(0));
  } else {
    app.cells.pop();
    app.cells.shift();
  }
  
  for (let i = 0; i < app.size; i++) {
    
    if (delta > 0) {
      app.cells[i].push(0);
      app.cells[i].unshift(0);
    } else {
      app.cells[i].pop();
      app.cells[i].shift();
    }
    
    for (let j = 0; j < app.size; j++) {
      let cell = document.createElement("div");
      cell.style.width = app.cellSize;
      cell.style.height = app.cellSize;
      cell.className = "cell";
      if (app.cells[i][j] === 1) cell.classList.toggle("active");
      app.field.appendChild(cell);
      cell.onclick = function() { setCell(cell, j, i, app) }; 
    }
    
  }
  
}

function startPlaying(app) {
  app.timer = setInterval(() => nextStep(app), 1000);
  app.startButton.disabled = true;
  app.stopButton.disabled = false;
  app.incButton.disabled = true;
  app.decButton.disabled = true;
}

function stopPlaying(app) {
  clearInterval(app.timer);
  app.startButton.disabled = false;
  app.stopButton.disabled = true;
  app.incButton.disabled = false;
  app.decButton.disabled = false;
}