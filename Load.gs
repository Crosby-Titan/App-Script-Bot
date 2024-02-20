function LoadData(fileId) {
  let document = DocumentApp.openById(fileId);

  return document.getBody().getText();
}
