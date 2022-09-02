document.body.onload = function() {
    let cells = [];
    let size = 20;
    makeField(size, cells);
    document.getElementById("next-btn").onmousedown = () => prepareChanges(cells);
    document.getElementById("next-btn").onmouseup = () => performChanges(cells);
    document.getElementById("clear-btn").onclick = () => clear(cells);
    document.getElementById("inc-size-btn").onclick = () => newFieldSize(1, cells);
    document.getElementById("dec-size-btn").onclick = () => newFieldSize(-1, cells);
    let game = {timer: 0};
    document.getElementById("start-btn").onclick = () => startPlaying(game, cells);
    stopButton = document.getElementById("stop-btn");
    stopButton.onclick = () => stopPlaying(game);
    stopButton.disabled = true;

    
};

function makeField(size, cells) {
  const field = document.getElementById("field");
  const winSize = window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth;
  const cellSize = ((winSize - 30) / size | 0) + "px";
  field.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  for (let i = 0; i < size; i++) {
    let cellsLine = [];
    for (let j = 0; j < size; j++) {

      let cell = document.createElement("div");
      cell.style.width = cellSize;
      cell.style.height = cellSize;
      cell.className = "cell";
      field.appendChild(cell);
      cellsLine.push(0);
      cell.onclick = function() { setCell(cell, j, i, cells) }; 
    }
    cells.push(cellsLine);
  }
}
 
function setCell(cell, x, y, cells) {
  cell.classList.toggle("active");
  cells[y][x] = cells[y][x] != 0 ? 0 : 1;
}

function nextStep(cells) {
  prepareChanges(cells);
  setTimeout(() => performChanges(cells), 500);
}

function prepareChanges(cells) {
  let field = document.getElementById("field");
  for (let i = 0; i < cells.length; i++) {
    for(let j = 0; j < cells[0].length; j++) {
      let ns = countNeighbours(cells, j, i);
      if (cells[i][j] > 0 && (ns > 3 || ns < 2)) {
        cells[i][j] = 2;
        field.childNodes[coordToNum(j, i, cells.length)].classList.toggle("active");
        field.childNodes[coordToNum(j, i, cells.length)].classList.toggle("dead");
      } else if (cells[i][j] === 0 && ns == 3) {
        cells[i][j] = -2;
        field.childNodes[coordToNum(j, i, cells.length)].classList.toggle("born");
      }
    }
  }
}

function performChanges(cells) {
  let field = document.getElementById("field");
  for (let i = 0; i < cells.length; i++) {
    for(let j = 0; j < cells[0].length; j++) {
      let ns = countNeighbours(cells, j, i);
      if (cells[i][j] == 2) {
        cells[i][j] = 0;
        field.childNodes[coordToNum(j, i, cells.length)].classList.toggle("dead");
      } else if (cells[i][j] == -2) {
        cells[i][j] = 1;
        field.childNodes[coordToNum(j, i, cells.length)].classList.toggle("born");
        field.childNodes[coordToNum(j, i, cells.length)].classList.toggle("active");
      }
    }
  }
}

function clear(cells) {
  let field = document.getElementById("field");
  for (let i = 0; i < cells.length; i++) {
    for(let j = 0; j < cells[0].length; j++) {
      cells[i][j] = 0;
      field.childNodes[coordToNum(j, i, cells.length)].className = "cell";;
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

function newFieldSize(delta, cells) {
  let field = document.getElementById("field");
  field.innerHTML = '';
  const winSize = window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth;
  const size = cells[0].length + 2 * delta;
  const cellSize = ((winSize - 30) / size | 0) + "px";
  field.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  if (delta > 0) {
    cells.push(Array(size-2).fill(0));
    cells.unshift(Array(size-2).fill(0));
  } else {
    cells.pop();
    cells.shift();
  }
  
  for (let i = 0; i < size; i++) {
    
    if (delta > 0) {
      cells[i].push(0);
      cells[i].unshift(0);
    } else {
      cells[i].pop();
      cells[i].shift();
    }
    
    for (let j = 0; j < size; j++) {
      let cell = document.createElement("div");
      cell.style.width = cellSize;
      cell.style.height = cellSize;
      cell.className = "cell";
      if (cells[i][j] === 1) cell.classList.toggle("active");
      field.appendChild(cell);
      cell.onclick = function() { setCell(cell, j, i, cells) }; 
    }
    
  }
  
}

function startPlaying(game, cells) {
  game.timer = setInterval(() => nextStep(cells), 1000);
  document.getElementById("start-btn").disabled = true;
    document.getElementById("stop-btn").disabled = false;
}

function stopPlaying(game) {
  clearInterval(game.timer);
  document.getElementById("start-btn").disabled = false;
    document.getElementById("stop-btn").disabled = true;;
}