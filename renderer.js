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

  for (let f of e.dataTransfer.files) {
      console.log('File(s) you dragged here: ', f.path)
      ipcRenderer.send('filereceived', f.path)
  }
  
  return false
}
