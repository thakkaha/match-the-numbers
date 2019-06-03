const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const defaultRows = 5;
const defaultCols = 5;
const defaultMinDigit = 0;
const defaultMaxDigit = 2;
const defaultMoveType = true;
const defaultIncrease = true;
let rows = defaultRows;
let cols = defaultCols;
let minDigit = defaultMinDigit;
let maxDigit = defaultMaxDigit;
let moveType = defaultMoveType;
let increase = defaultIncrease;
let index = 0;

const label = {
  height: 25,
  font: '25px Monospace',
  paddingX: 10,
  paddingY: 5,
  color: '#111111',
  selectedColor: '#FF0000'
};

let labels = [];

ctx.font = label.font;
const metrics = ctx.measureText('0');
const charWidth = metrics.width + label.paddingX;
const charHeight = label.height + label.paddingY;
resetInputs();
resizeHandler();
restart();
draw();
document.getElementById('move').addEventListener('change', function () {
  moveType = this.checked;
  if (moveType) {
    document.getElementById('moveText').innerHTML = 'target';
  } else {
    document.getElementById('moveText').innerHTML = 'source';
  }
});
document.getElementById('increase').addEventListener('change', function () {
  increase = this.checked;
  if (increase) {
    document.getElementById('increaseText').innerHTML = 'Increase';
  } else {
    document.getElementById('increaseText').innerHTML = 'Decrease';
  }
});
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
window.addEventListener('resize', resizeHandler);

function resetInputs () {
  document.getElementById('rows').value = rows;
  document.getElementById('cols').value = cols;
  document.getElementById('min').value = minDigit;
  document.getElementById('max').value = maxDigit;
  document.getElementById('move').checked = moveType;
  document.getElementById('increase').checked = increase;
}

window.save = function () {
  rows = Math.min(+document.getElementById('rows').value, Math.floor(canvas.height / charHeight));
  cols = Math.min(+document.getElementById('cols').value, Math.floor(canvas.width / charWidth));
  minDigit = +document.getElementById('min').value;
  maxDigit = +document.getElementById('max').value;
};

function restart () {
  index = 0;
  const marginX = (canvas.width - cols * charWidth) / 2;
  const marginY = (canvas.height - rows * charHeight) / 3;
  labels = [];
  for (let i = 1; i <= rows; i++) {
    for (let j = 0; j < cols; j++) {
      labels.push({
        x: j * charWidth + marginX,
        y: i * charHeight + marginY,
        code: Math.floor(Math.random() * (maxDigit - minDigit) + 48 + minDigit),
        color: label.color
      });
    }
  }
  labels[index].color = label.selectedColor;
}

function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = label.font;
  for (const l of labels) {
    ctx.fillStyle = l.color;
    ctx.fillText(String.fromCharCode(l.code), l.x, l.y);
  }
  window.requestAnimationFrame(draw);
}

function keyDownHandler (e) {
  const old = index;
  let change = false;
  if (e.keyCode === 38 && index >= cols) {
    index -= cols;
    change = true;
  }
  if (e.keyCode === 40 && index < labels.length - cols) {
    index += cols;
    change = true;
  }
  if (e.keyCode === 37 && index % cols !== 0) {
    index--;
    change = true;
  }
  if (e.keyCode === 39 && index % cols !== cols - 1) {
    index++;
    change = true;
  }
  if (change) {
    if (moveType) {
      if (increase) {
        if (labels[index].code === maxDigit + 48) {
          labels[index].code = minDigit + 48;
        } else {
          labels[index].code++;
        }
      } else {
        if (labels[index].code === minDigit + 48) {
          labels[index].code = maxDigit + 48;
        } else {
          labels[index].code--;
        }
      }
    } else {
      if (increase) {
        if (labels[old].code === maxDigit + 48) {
          labels[old].code = minDigit + 48;
        } else {
          labels[old].code++;
        }
      } else {
        if (labels[old].code === minDigit + 48) {
          labels[old].code = maxDigit + 48;
        } else {
          labels[old].code--;
        }
      }
    }
    labels[old].color = label.color;
    labels[index].color = label.selectedColor;
    for (const l of labels) {
      if (increase) {
        if (l.code !== maxDigit + 48) {
          return;
        }
      } else {
        if (l.code !== minDigit + 48) {
          return;
        }
      }
    }
    window.alert('CONGRATULATIONS, YOU FINISHED!');
    restart();
  }
}

function keyUpHandler (e) {
  if (e.keyCode === 82) {
    rows = defaultRows;
    cols = defaultCols;
    minDigit = defaultMinDigit;
    maxDigit = defaultMaxDigit;
    moveType = defaultMoveType;
    increase = defaultIncrease;
    resetInputs();
  }
}

function resizeHandler () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 40;
}
