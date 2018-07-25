let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let rows = 5;
let cols = 5;
let minDigit = 0;
let maxDigit = 2;
let moveType = true;
let increase = true;
let index = 0;

let label = {
  height: 25,
  font: '25px Monospace',
  paddingX: 10,
  paddingY: 5,
  color: '#111111',
  selectedColor: '#FF0000'
};

let labels = [];

document.addEventListener('keydown', keyDownHandler);
document.getElementById('rows').value = rows;
document.getElementById('cols').value = cols;
document.getElementById('min').value = minDigit;
document.getElementById('max').value = maxDigit;
document.getElementById('move').checked = moveType;
document.getElementById('move').addEventListener('change', function () {
  moveType = this.checked;
  if (moveType) {
    document.getElementById('moveText').innerHTML = 'target';
  } else {
    document.getElementById('moveText').innerHTML = 'source';
  }
});
document.getElementById('increase').checked = increase;
document.getElementById('increase').addEventListener('change', function () {
  increase = this.checked;
  if (increase) {
    document.getElementById('increaseText').innerHTML = 'Increase';
  } else {
    document.getElementById('increaseText').innerHTML = 'Decrease';
  }
});
ctx.font = label.font;
let metrics = ctx.measureText('0');
resizeHandler();
restart();
draw();
window.addEventListener('resize', resizeHandler);

function save () {
  rows = +document.getElementById('rows').value;
  if (rows > Math.floor(canvas.height / (label.height + label.paddingY))) {
    rows = Math.floor(canvas.height / (label.height + label.paddingY));
  }
  cols = +document.getElementById('cols').value;
  if (cols > Math.floor(canvas.width / (metrics.width + label.paddingX))) {
    cols = Math.floor(canvas.width / (metrics.width + label.paddingX));
  }
  minDigit = +document.getElementById('min').value;
  maxDigit = +document.getElementById('max').value;
}

function restart () {
  index = 0;
  let marginX = canvas.width - cols * (metrics.width + label.paddingX);
  let marginY = canvas.height - rows * (label.height + label.paddingY);
  labels = [];
  for (let i = 1; i <= rows; i++) {
    for (let j = 0; j < cols; j++) {
      labels.push({
        x: j * (metrics.width + label.paddingX) + marginX / 2,
        y: i * (label.height + label.paddingY) + marginY / 3,
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
  for (let l of labels) {
    ctx.fillStyle = l.color;
    ctx.fillText(String.fromCharCode(l.code), l.x, l.y);
  }
  window.requestAnimationFrame(draw);
}

function keyDownHandler (e) {
  let old = index;
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
    for (let l of labels) {
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

function resizeHandler () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 40;
}
