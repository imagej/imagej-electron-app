// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { ipcRenderer } = require('electron')
const fs = require('fs')

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
      var depth = dims[2].longValue();
      console.log('Dimensions = ' + width + ', ' + height + ', ' + depth);

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

      var iterator = Views.flatIterable(data).iterator()
      var i = 0
      var data = []
      while (iterator.hasNext()) {
        data[i++] = iterator.next().getRealDouble()
      }
      console.log('got data of length: ' + data.length + '; middle value = ' + data[data.length / 2])
      console.log(data)

      imageBlit(
        "image",
        data,
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
if (!config.imagej_dir) {
  // Search for ImageJ in common locations (covers npm run, electron app, and standard OS X)
  imagej_paths = ["Fiji.app", "../Resources/app/Fiji.app", "/Applications/Fiji.app"]
  for (const ijp of imagej_paths) {
    if (fs.existsSync(ijp)) {
      config.imagej_dir = ijp;
      break;
    }
  }
}

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
