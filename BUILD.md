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
```

## Install the java deps
```
./node_modules/.bin/node-java-maven
```

## Finally, go:
```
npm start
```
