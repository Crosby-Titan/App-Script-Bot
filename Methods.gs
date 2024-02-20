function SendMessage(chatId,text){
  UseMethod(API_METHODS.sendMessage,{"chat_id": chatId, "text": text});
}

function SendPhoto(chatId,photoUrl){
  UseMethod(API_METHODS.sendPhoto,{"chat_id": chatId, "photo": photoUrl});
}

function SendSticker(chatId,stickerUrl){
  UseMethod(API_METHODS.sendSticker,{"chat_id": chatId, "sticker": stickerUrl});
}

function UseMethod(apiMethod,data){

  UrlFetchApp.fetch(API_URL + apiMethod,{
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(data)
  });

}
