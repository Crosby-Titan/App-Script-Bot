function doPost(e){

  let data = JSON.parse(e.postData.contents);
  
  let update = GetUpdate(data);

  WriteToSheet(update.message);

  Handler(update.message);

}

function doGet(e){
  throw new Error("Method not implemented");
}
