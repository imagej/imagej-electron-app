// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { ipcRenderer } = require('electron')

var holder = document.getElementById('drag-file')

holder.ondragover = () => {
    return false;
}

holder.ondragleave = () => {
    return false;
}

holder.ondragend = () => {
    return false;
}

holder.ondrop = (e) => {
  e.preventDefault()

  var java = require('java')
  var Views = java.import('net.imglib2.view.Views')
  var Intervals = java.import('net.imglib2.util.Intervals')

  for (let f of e.dataTransfer.files) {
    console.log('File(s) you dragged here: ', f.path)
    var filePath = f.path
    console.log('Asking ImageJ to read: ' + filePath)
    console.log('ij in DRAG AND DROP function = ' + ij)
    ij.scifio().datasetIO().openPromise(filePath).then(data => {
      // Ensure the data is (at least) 3-dimensional.
      while (data.numDimensions() < 3) {
        data = Views.addDimension(data, 0, 0);
      }

      // Extract dimensional lengths.
      var dims = Intervals.dimensionsAsLongArray(data);
      var width = dims[0].longValue();
      var height = dims[1].longValue();
      var channels = dims[2].longValue();
      console.log('Dimensions = ' + width + ' x ' + height + ' -- ' + channels + ' channels');

      // Extract the pixel type.
      var typeName = data.firstElement().getClass().getName();
      var pixeltype
      if (typeName.endsWith(".UnsignedByteType")) {
        pixeltype = "uint8";
      }
      else if (typeName.endsWith(".UnsignedShortType")) {
        pixeltype = "uint16";
      }
      else {
        pixeltype = "float32";
      }
      console.log('Type = ' + pixeltype + ' (' + typeName + ')');

      var extended = channels == 2 ? Views.extendZero(data) : Views.extendBorder(data)
      var access = extended.randomAccess()
      var i = 0
      var pixels = []
      for (var y = 0; y < height; y++) {
        access.setPosition(y, 1);
        for (var x = 0; x < width; x++) {
          access.setPosition(x, 0);
          for (var c = 0; c < 3; c++) {
            access.setPosition(c, 2);
            pixels[4 * i + c] = access.get().getRealDouble()
          }
          pixels[4 * i + 3] = 255 // alpha channel
          i++;
        }
      }
      console.log('got pixels of length: ' + pixels.length + '; middle value = ' + pixels[pixels.length / 2])
      console.log(pixels)

      imageBlit(
        "image",
        pixels,
        width,
        height
      );
      // START HERE - Why can't I do this?
      //ipcMain.send('parsecomplete', info);

      // TODO: handle axis types:
      // - data.axis(0)
      // TODO: handle physical sizes:
      // - ((CalibratedAxis) data.axis(0)).averageScale(0, 1)
    });
  }
  return false
}

var imagejButton = document.getElementById('imagej')

console.log('==> Booting Java');

config = {}
config.headless = true
config.imagej_dir = process.env.IMAGEJ_DIR
if (!config.imagej_dir) throw ('Please set IMAGEJ_DIR to your ImageJ installation folder.')

console.log("==> Initializing ImageJ from renderer process")
var imagej = require('imagej')(config)
console.log("==> Waiting for ImageJ to report back")

var ij
imagej.on('ready', function(theIJ) {
  console.log('==> ImageJ READY')
  ij = theIJ
})

imagejButton.onclick = (e) => {
  console.log('Displaying the ImageJ UI');
  ij.ui().showUILater();
  return false;
}

function imageBlit(target, ndarray, width, height) {
  let canvas = document.getElementById(target);
  let imgState = canvas.imgState;
  if (!imgState) {
    // initialize context & stash in the canvas
    let context = canvas.getContext("2d");
    imgState = {
      width: width,
      height: height,
      context: context,
      imageData: context.createImageData(width, height)
    };
    canvas.imgState = imgState;
  }
  imgState.imageData.data.set(ndarray);
  imgState.context.putImageData(imgState.imageData, 0, 0);
}
