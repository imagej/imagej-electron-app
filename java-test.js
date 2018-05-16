var java = require('java');
var mvn = require('node-java-maven');

mvn(function(err, mvnResults) {
  if (err) {
    return console.error('could not resolve maven dependencies', err);
  }
  mvnResults.classpath.forEach(function(c) {
    console.log('adding ' + c + ' to classpath');
    java.classpath.push(c);
  });

  var System = java.import('java.lang.System');
  System.setProperty('java.awt.headless', 'true');

  var ImageJ = java.import('net.imagej.ImageJ');
  ij = ImageJ();

  dataPath = "http://imagej.net/images/clown.jpg";
  data = ij.scifioSync().datasetIOSync().openSync(dataPath);
  //var FileUtils = java.import('org.scijava.util.FileUtils');
  //var File = java.import('java.io.File');
  //file = File('/Users/curtis/code/czi/imaging-electron-app/README.md');
  //FileUtils.readFile(file);
  console.log("Got an image: " + data);
});

