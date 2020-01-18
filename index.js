var textField = document.getElementById("text");
var colorField = document.getElementById("color");
var resultField = document.getElementById("result");

function generate() {
  var text = textField.value.toLowerCase();

  var chars = [];

  for (var i = 0; i < text.length; i++) {
    var char = text.charAt(i);
    if (char === "\n") {
      var obj = "\n";
    } else {
      var obj = data.chars[char];
    }
    chars.push(obj);
  }

  var result = data.svg.head;

  var color = colorField.value;
  result += "<path d=\"" + data.svg.box + "\" fill=\"" + color + "\"/>";

  var char1 = chars.shift();
  var char2 = chars.shift();

  var logoCharsWidth = char1.width + char2.width;


  var leftOverflow = 0;
  if (logoCharsWidth === 15) {
    leftOverflow = 1;
  } else if (logoCharsWidth === 16) {
    leftOverflow = 2;
  }

  result += getChar(2 - leftOverflow, 2, char1);
  result += getChar(2 + char1.width - leftOverflow, 2, char2);

  var x = 17;
  var y = 2;

  chars.forEach((i) => {
    if (i === "\n") {
      x = 17;
      y += 13;
    } else {
      result += getChar(x, y, i);
      x += i.width + 1;
    }
  });

  result += data.svg.body;
  resultField.innerHTML = result;
}

function getChar(x, y, char) {
  return "<g transform=\"translate(" + x + ", " + y + ")\"><path d=\"" +
    char.path + "\"/></g>";
}
