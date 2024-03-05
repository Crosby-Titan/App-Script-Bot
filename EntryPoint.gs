async function doPost(e){

  let data = JSON.parse(e.postData.contents);
  let checker = new UserHelper("UserStatus");

  let update = Update.createFrom(data);
 
  let username = (update.callback_query != null) ? update.callback_query.from.username : update.message.from.username;

  if(!checker.isUserExists(username)){
    checker.appendNewUser(update.message.chat.id,username);
  }

  await statusHandler(update,checker,username);
  
}

function doGet(e){
  throw new Error("Method not implemented");
}


