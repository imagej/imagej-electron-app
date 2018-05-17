const electron = require('electron')
const { ipcMain } = require('electron')

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

console.log('==> Java is booting');

var java = require('java');
var mvn = require('node-java-maven');

mvn(function(err, mvnResults) {
  console.log('inside maven')
  if (err) {
    return console.error('could not resolve maven dependencies', err);
  }
  mvnResults.classpath.forEach(function(c) {
    console.log('adding ' + c + ' to classpath');
    java.classpath.push(c);
  });

  java.asyncOptions = {
    asyncSuffix: "Async",
    syncSuffix: "",
    promiseSuffix: "Promise",
    promisify: require("when/node").lift
  };

  var System = java.import('java.lang.System');
  var javaVersion = System.getProperty('java.version');
  console.log('==> Java version = ' + javaVersion);

  console.log('==> ImageJ STARTING!');
  var ImageJ = java.import('net.imagej.ImageJ');
  ij = ImageJ();
  console.log('==> ImageJ READY!');

  var Views = java.import('net.imglib2.view.Views');
  var Intervals = java.import('net.imglib2.util.Intervals');

  var volumes = new Map();

  ipcMain.on('showimagejui', (event) => {
    console.log('Displaying the ImageJ UI');
    ij.ui().showUIAsync();
  });

  ipcMain.on('filereceived', (event, filePath) => {
    console.log('Asking ImageJ to read: ' + filePath);
    ij.scifio().datasetIO().openPromise(filePath).then(data => {
      volumes.set(filePath, data);

      // Ensure the data is (at least) 3-dimensional.
      while (data.numDimensions() < 3) {
        data = Views.addDimension(data, 0, 0);
      }

      // TODO: handle axis types:
      // - data.axis(0)
      // TODO: handle physical sizes:
      // - ((CalibratedAxis) data.axis(0)).averageScale(0, 1)

      // Extract dimensional lengths.
      dims = Intervals.dimensionsAsLongArray(data);
      x = dims[0].longValue();
      y = dims[1].longValue();
      z = dims[2].longValue();
      console.log('Dimensions = ' + x + ', ' + y + ', ' + z);

      // TODO: send message to renderer? tell dimensions and data type
    });
    // 1. Where do we send these bytes/data?
    // 2. Actually change this to read an image and extract its bytes/data.
    // 3. Asynchronous?
  });

  ipcMain.on('blockrequested', (event, block) => {
    data = volumes.get(block.path);
    region = Views.interval(data, block.min, block.max);
    // START HERE: copy the region into desired primitive(?) structure.
  });
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 600, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
