/* Update the rpath associated with nodejavabridge_bindings.node to use the bundled JRE.
 */

// install_name_tool -rpath /Library/Java/JavaVirtualMachines/jdk1.8.0_112.jdk/Contents/Home/jre/lib/server jre1.8.0_172.jre/Contents/Home/lib/server/ node_modules/java/build/Release/nodejavabridge_bindings.node

require('find-java-home')(function(err, home){
  if(err){
    console.error(err);
    process.exit(1);
  }

  if (process.platform === 'darwin') {
    var rpath = home + "/jre/lib/server";
    var newrpath = "jre1.8.0_172.jre/Contents/Home/lib/server/"
    var lib = "node_modules/java/build/Release/nodejavabridge_bindings.node"
    cmd = "install_name_tool -rpath " + rpath + " " + newrpath + " " + lib;
    process.stdout.write(home + '\n');
    process.stdout.write(rpath + '\n');
    process.stdout.write(cmd + '\n')
    const { exec } = require('child_process');

    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        console.error("[May not be an error if previously run.]");
        return;
      }
      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
  } else {
    console.error("Unsupported platform: " + process.platform);
    process.exit(1);
  }

});
