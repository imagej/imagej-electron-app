On macOS, you might need:
```
npm config set python /usr/bin/python
```
This ensure Python 2, as needed by node-gyp, as used by "npm install java"

## Install JS deps
```
npm install
```

## Probably will need to rebuild electron for this node version:
```
./node_modules/.bin/electron-rebuild
node ./node_modules/java/postInstall.js
```

## Install the java deps
```
./node_modules/.bin/node-java-maven
```

## Manual download of JRE
MacOS:
```curl https://downloads.imagej.net/java/macosx.tar.gz | tar vzx```

Linux:
```curl https://downloads.imagej.net/java/linux-amd64.tar.gz | tar vzx```

This will expand as ```jre1.8.0_172.jre```.

## Update the rpath in nodejavabridge_bindings.node for a relative path
```node  fixrpath.js```

## Finally, go:
```
npm start
```

# To create a bundled app
## Run electron-package
MacOS:
```npm run package-mac```


