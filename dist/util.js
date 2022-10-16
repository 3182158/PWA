// local functions
function isLeave(element)
{
  const ctsFileuploadDiv = document.getElementById('cts-fileupload-div');
  const ctsNoteDiv = document.getElementById('cts-note-div');
  
  if(element.checked){
    ctsFileuploadDiv.style.display = "block";
    ctsNoteDiv.style.display = "none";
  }else{
    ctsFileuploadDiv.style.display = "none";
    ctsNoteDiv.style.display = "block";
  }
}
