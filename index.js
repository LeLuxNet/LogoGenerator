function generate() {
  var text = $("#text").value.toLowerCase();

  var result = "";
  if (text.length >= 2) {
    var chars = [];

    for (var i = 0; i < text.length; i++) {
      var char = text.charAt(i);
      if (char === "\n") {
        var obj = "\n";
      } else {
        var obj = data.chars[char];
      }
      if (obj != null) {
        chars.push(obj);
      }
    }

    if ($("#show-bg-color").checked) {
      result += '<rect width="100%" height="100%" fill="' +
        $("#bg-color").value + "\"/>";
    }
    result += '<g id="svg-root" fill="' + $("#text-color").value +
      '"><path d="' + data.svg.box + '" fill="' + $("#color").value + '"/>';

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
    var realX = 16;

    chars.forEach((i) => {
      if (i === "\n") {
        x = 17;
        y += 13;
      } else {
        result += getChar(x, y, i);
        var x2 = x + i.width;
        if (realX < x2) {
          realX = x2;
        }
        x += i.width + 1;
      }
    });
    result += "</g>";

    $("#processing").innerHTML = result;

    var realY = (y === 2) ? 16 : (y + 12);

    var resolutionField = $("#resolution");
    var mult = resolutionField.selectedIndex === -1 ? 1 :
      resolutionField.options[resolutionField.selectedIndex].value;
    var resolutionResult = "";
    for (var i = 1; i <= 100; i++) {
      resolutionResult += '<option value="' + i + '"' +
        (i == mult ? " selected" : "") + ">" + i + "x (" +
        (realX * i) + "x" + (realY * i) + ")</option>";
    }
    resolutionField.innerHTML = resolutionResult;
    $$(".show-download").forEach(e => e.classList.remove("hidden"));

    svg2File(realX, realY, 10, (data) => $("#result").src = data);
    svg2File(realX, realY, mult, (data) => $("#png").href = data);
  }
}

function getChar(x, y, char) {
  return '<g transform="translate(' + x + ', ' + y + ')"><path d="' +
    char.path + '"/></g>';
}

function svg2File(oldW, oldH, mult, callback) {
  var w = oldW * mult;
  var h = oldH * mult;

  var img = document.createElement("img");
  var svgNode = $("#processing").cloneNode(true);
  svgNode.getElementById("svg-root").setAttribute("transform",
    "scale(" + mult + ")");
  var svg = new XMLSerializer().serializeToString(svgNode);
  img.setAttribute("src", 'data:image/svg+xml;base64,' + btoa(svg));

  var canvas = document.createElement("canvas");

  canvas.width = w;
  canvas.height = h;
  img.onload = function() {
    canvas.getContext("2d").drawImage(img, 0, 0, w, h);
    callback(canvas.toDataURL("image/png"));
  }
};
