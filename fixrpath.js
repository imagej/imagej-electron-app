/* Update the rpath associated with nodejavabridge_bindings.node to use the bundled JRE.
 *
 * This is for OS X only.
 */

function deletepath(binary, rpath) {
  if (process.platform === 'darwin') {
    cmd = "install_name_tool -delete_rpath " + rpath + " " + binary;
    process.stdout.write(cmd + '\n')
    const { exec } = require('child_process');

    exec(cmd, (err, stdout, stderr) => {
      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      if (err) {
        console.error(err);
        console.error("[May not be an error if previously run.]");
      }
    });
  } else {
    console.error("Unsupported platform: " + process.platform);
    process.exit(1);
  }
}

function addpath(binary, rpath) {
  if (process.platform === 'darwin') {
    cmd = "install_name_tool -add_rpath " + rpath + " " + binary;
    process.stdout.write(cmd + '\n')
    const { exec } = require('child_process');

    exec(cmd, (err, stdout, stderr) => {
      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      if (err) {
        console.error(err);
        console.error("[May not be an error if previously run.]");
      }
    });
  } else {
    console.error("Unsupported platform: " + process.platform);
    process.exit(1);
  }
}

require('find-java-home')(function(err, home){
  if(err){
    console.error(err);
    process.exit(1);
  }

  var binary = "node_modules/java/build/Release/nodejavabridge_bindings.node";
  /* Delete original rpath, which references the java used to compile */
  deletepath(binary, home + "/jre/lib/server");

  /* Add reference to downloaded JRE */
  addpath(binary, "Fiji.app/java/macosx/jdk1.8.0_172.jre/jre/Contents/Home/lib/server");

  addpath(binary, "@executable_path/../Resources/app/Fiji.app/java/macosx/jdk1.8.0_172.jre/jre/Contents/Home/lib/server");

});


