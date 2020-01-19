var textField = document.getElementById("text");
var colorField = document.getElementById("color");
var bgColorField = document.getElementById("bgcolor");
var showBgColorField = document.getElementById("showbgcolor");
var textColorField = document.getElementById("textcolor");
var resultField = document.getElementById("result");
var pngField = document.getElementById("png");

function generate() {
  var text = textField.value.toLowerCase();

  var result = "";

  if (text.length < 2) {

  } else {

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

    if (showBgColorField.checked) {
      result += "<rect width=\"100%\" height=\"100%\" fill=\"" +
        bgColorField.value + "\"/>";
    }
    result += "<g id=\"svg-root\" fill=\"" + textColorField.value +
      "\"><path d=\"" + data.svg.box + "\" fill=\"" + colorField.value + "\"/>";

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
    var maxX = 16;

    chars.forEach((i) => {
      if (i === "\n") {
        x = 17;
        y += 13;
      } else {
        result += getChar(x, y, i);
        var x2 = x + i.width;
        if (maxX < x2) {
          maxX = x2;
        }
        x += i.width + 1;
      }
    });

    result += "</g>";
  }
  resultField.innerHTML = result;

  svg2File(maxX, (y === 2) ? 16 : (y + 12), 10);
}

function getChar(x, y, char) {
  return "<g transform=\"translate(" + x + ", " + y + ")\"><path d=\"" +
    char.path + "\"/></g>";
}

function svg2File(oldW, oldH, mult) {
  var w = oldW * mult;
  var h = oldH * mult;

  var img = document.createElement("img");
  var svgNode = resultField.cloneNode(true);
  svgNode.getElementById("svg-root").setAttribute("transform",
    "scale(" + mult + ")");
  var svg = new XMLSerializer().serializeToString(svgNode);
  img.setAttribute("src", 'data:image/svg+xml;base64,' + btoa(svg));

  var canvas = document.createElement("canvas");

  canvas.width = w;
  canvas.height = h;
  img.onload = function() {
    canvas.getContext("2d").drawImage(img, 0, 0, w, h);
    pngField.href = canvas.toDataURL("image/png");
  }
};
