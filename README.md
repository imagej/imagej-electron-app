# ImageJ via Electron

[Electron](https://electronjs.org/) is a technology enabling desktop apps using
the [Node.js](https://nodejs.org/) JavaScript runtime.

This repository is an attempt to package [ImageJ](https://imagej.net/) as an
Electron app, so that it can be combined with JavaScript user interface
elements, with an eventual possible goal of recasting the core ImageJ UI in
JavaScript.

## Why Electron

* __User interface.__ The Node.js community has produced much UI awesomeness,
  and will continue to do so. ImageJ would benefit from UI components such as
  image viewers that target a broad array of use cases including both web and
  desktop.

* __Polyglot.__ ImageJ is grounded in the Java ecosystem, but strives for
  universal accessibility. There is a vast breadth of powerful software,
  and the ability to combine tools across ecosystems may mean the difference between
  a successful scientific workflow and a costly software development endeavor.

* __Packaging.__ ImageJ and its sister project [Fiji](https://fiji.sc/)
  currently use a custom [native launcher](https://imagej.net/Launcher) and
  custom packaging system which pose numerous challenges relating to native
  integration. The Node.js / Electron ecosystem has solved native desktop
  application packaging in a more modern way, which is likely to continue to
  work for many years to come.
    * The current ImageJ launcher is ~4000 lines of C code with many
    platform-specific `#define`s. This code must be regularly maintained
    and updated to accommodate the constantly evolving requirements and
    restrictions of operating systems and Java versions.

## Installation

```
npm install
npm run rebuild
npm run postinstall
npm start
```

## Technical challenges and questions

A sloppy list of questions and technical issues follows.
To be cleaned up and organized soon!

* __Integration__ - How to pass options to the JVM via node-java
* __Integration__ - How to mix in Python
* __Electron__ - How to process Electron CLI args
* __Electron__ - Bundle JVM and/or JAR libraries into the app
* __Electron__ - How to override native things e.g. icon, systray
* __Electron__ - Splash screen while app is loading
* __Electron__ - JS menu builder - add IJ menu items but also support JS plugins that register menu items
* __JS dev practices__ - Is there a good JS editor with autocomplete? (WebStorm, I guess)
* __JS dev practices__ - How to organize sources, code style, multiple files, clean methods, etc
* __Infrastructure__ - Travis CI builds, AppVeyor builds
* __ImageJ__ - Integrate a JS script editor plugin? Atom? Something else?
* __ImageJ__ - What about ImageJ plugins dirs? (set `imagej.dir` property?)
* __Viewers__ - [VTK.js](https://github.com/Kitware/vtk-js) viewer
* __Viewers__ - [ivvv](https://github.com/imaging-tools/ivvv) viewer
