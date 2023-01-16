var options = ["$100", "$10", "$25", "$250", "$30", "$1000", "$1", "$200", "$45", "$500", "$5", "$20", "Lose"];

var startAngle = 0;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;

var ctx;

var list = []; // create an empty list

function addToList() {
  // Get the value of the input field
  var inputField = document.getElementById("inputField");
  var item = inputField.value;

  // Add the item to the list
  list.push(item);

  // Get the list element
  var ul = document.getElementById("myList");

  // Create a new list item element
  var li = document.createElement("li");
  li.classList.add('listItem');

  // Set the text content of the new list item to the item
  li.textContent = item;

  let deleteBtn = document.createElement("button");
  deleteBtn.classList.add('deleteBtn');
  deleteBtn.appendChild(document.createTextNode("X"));
  deleteBtn.addEventListener("click", function() {
    this.closest(".deleteBtn").remove();
    li.closest(".listItem").remove();
  });

  // Append the new list item to the list element
  ul.appendChild(li);
  ul.appendChild(deleteBtn);

  // Clear the input field
  inputField.value = "";
}


function removeElem() {
  const ul = document.getElementById('myList');
  const liElements = ul.querySelectorAll('li');
  options.splice(liElements.length);
  console.log(options.length);
  arc = Math.PI / (options.length / 2);

  drawRouletteWheel();
}

function changeList() {

  const ul = document.getElementById('myList');
  const liElements = ul.querySelectorAll('li');
  liElements.forEach((li, index) => options[index] = li.textContent);
}

/*     const stringArray = Array.from(liElements).map(li => li.textContent); */

changeList();

document.getElementById("spin").addEventListener("click", spin);

function byte2Hex(n) {
  var nybHexString = "0123456789ABCDEF";
  return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

function RGB2Color(r,g,b) {
  return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem) {
  var phase = 0;
  var center = 128;
  var width = 127;
  var frequency = Math.PI*2/maxitem;
  
  red   = Math.sin(frequency*item+2+phase) * width + center;
  green = Math.sin(frequency*item+0+phase) * width + center;
  blue  = Math.sin(frequency*item+4+phase) * width + center;
  
  return RGB2Color(red,green,blue);
}

function drawRouletteWheel() {
  var canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    var outsideRadius = 200;
    var textRadius = 160;
    var insideRadius = 125;

    ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,500,500);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;

    ctx.font = 'bold 14px Verdana';

    for(var i = 0; i < options.length; i++) {
      var angle = startAngle + i * arc;
      //ctx.fillStyle = colors[i];
      ctx.fillStyle = getColor(i, options.length);

      ctx.beginPath();
      ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
      ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();

      ctx.save();
      ctx.shadowOffsetX = -1;
      ctx.shadowOffsetY = -1;
      ctx.shadowBlur    = 0;
      /* ctx.shadowColor   = "rgb(220,220,220)"; */
      ctx.fillStyle = "black";
      ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius, 
                    250 + Math.sin(angle + arc / 2) * textRadius);
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      var text = options[i];
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    } 

    //Arrow
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
    ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.fill();
  }
}

function spin() {
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 4 * 1700; /* hier kann man die Drehdauer einstellen. */
  rotateWheel();
}

function rotateWheel() {
  spinTime += 30;
  if(spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawRouletteWheel();
  spinTimeout = setTimeout('rotateWheel()', 30);
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);
  var degrees = startAngle * 180 / Math.PI + 90;
  var arcd = arc * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcd);
  ctx.save();
  ctx.font = 'bold 30px Helvetica, Arial';
  var text = options[index]
  ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
  ctx.restore();
}

function easeOut(t, b, c, d) {
  var ts = (t/=d)*t;
  var tc = ts*t;
  return b+c*(tc + -3*ts + 3*t);
}

function removeLi() {

}


/* enter new items with enter */
var input = document.getElementById("inputField");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("addItem").click();
  }
});


drawRouletteWheel();