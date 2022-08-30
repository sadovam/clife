document.body.onload = function() {
    const cells = [];
    makeField(20, cells);
    document.getElementById("next-btn").onmousedown = () => prepareChanges(cells);
    document.getElementById("next-btn").onmouseup = () => performChanges(cells);
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
  setTimeout(() => { performChanges(cells); }, 500);
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
