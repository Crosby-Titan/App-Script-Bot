function messageHandler(message,checker) {

  switch(message.text)
  {
    case "/start":
      checker.setUserStatus(message.from.username,"NONE");
      TelegramApi.sendMessage(message.chat.id,`Привет, ${message.from.first_name}. Используй /menu чтобы вызвать меню бота.`);
      break;
    case "/menu":
      checker.setUserStatus(message.from.username,"AWAIT_CALLBACK_REQUEST");
      TelegramApi.sendPhotoWithReplyMarkup(message.chat.id,MENU_PHOTO_URL,"Меню бота",INLINE_KEYBOARD);
      break;
    case "/answergpt":
      checker.setUserStatus(message.from.username,"AWAIT_GPT_REQUEST");
      TelegramApi.sendMessage(message.chat.id,"Введите запрос");
      break;
    default:
      checker.setUserStatus(message.from.username,"NONE");
      TelegramApi.sendMessage(message.chat.id,"Неизвестная команда. Повторите попытку.");
      break;
  }
}

async function statusHandler(update,checker,username){

  switch(checker.getUserStatus(username))
  {
    case "AWAIT_FILE_LINK_REQUEST":
      FileHandler(update.message.chat.id,update.message.document)
      break;
    case "AWAIT_GPT_REQUEST":
      Spreadsheet.write(update.message);
      
      if(CURRENT_SPREAD_SHEET.getSheetByName(username) == null)
        Spreadsheet.createSheet(username);

      if(update.message.text.startsWith("/")){
        checker.setUserStatus(username,"NONE");
        statusHandler(update,checker,username);
        return;
      }

      TelegramApi.sendMessage(update.message.chat.id,await openAiHandler(update.message.from,update.message.text));
      break;
    case "AWAIT_CALLBACK_REQUEST":
      await callbackHandler(update,checker);
      break;
    case "NONE":
    default:
      Spreadsheet.write(update.message);
      messageHandler(update.message,checker);
      break;
  }
}

async function callbackHandler(update,checker){

  if(update.callback_query == null){
    checker.setUserStatus(update.message.from.username,"NONE");
    statusHandler(update,checker,update.message.from.username);
    return;
  }

  TelegramApi.resetButtonStatus(update.callback_query.id);

  switch(update.callback_query.data){
      case "/callback_sticker":
        await (( async ()=> { return TelegramApi.sendSticker(update.message.chat.id, STICKERS[Random.getRandomBetween(0,STICKERS.length - 1)]);})());
        break;
      case "/callback_photo":
         await ((async ()=>{ return TelegramApi.sendPhoto(update.message.chat.id,PHOTOS[Random.getRandomBetween(0,PHOTOS.length - 1)]);})());
        break;
      case "/callback_text":
         await ((async ()=>{ return TelegramApi.sendMessage(update.message.chat.id,TEXTS[Random.getRandomBetween(0,PHOTOS.length - 1)]);})());
        break;
      case "/callback_currency_rate":
        let rate = new CurrencyRate(`https://www.cbr-xml-daily.ru/daily_json.js`);
        await rate.GetCurrencyRate();
        await ((async ()=>{ return TelegramApi.sendMessageWithParseMode(update.message.chat.id,rate.toHtmlString(),"HTML");})());
        break;
      default:
        break;
  }
}

async function openAiHandler(user,query_text){

  let client = new GptClient(OPEN_AI_KEY,OPEN_AI_REQUEST_URL,AI_MODEL);

  //client.messages.push((()=>{
  //  let sheet = CURRENT_SPREAD_SHEET.getSheetByName(user.username);
//
  //  let lastAvailableData = sheet.getLastRow();
//
  //  if(lastAvailableData < 1)
  //    return null;
//
  //  let rawUserMessage = sheet.getRange(`A2:B${lastAvailableData}`).getValues();
  //  let rawAssistantMessage = sheet.getRange(`C2:D${lastAvailableData}`).getValues();
  //  let messages = [];
//
  //  for(let i = 0;i < lastAvailableData;i++){
  //    messages.push(new GptMessage(rawUserMessage[i][0],rawUserMessage[i][1]));
  //    messages.push(new GptMessage(rawAssistantMessage[i][0],rawAssistantMessage[i][1]));
  //  }
//
  //  return messages;
  //})());

  let result = await client.sendRequestAsync(new GptMessage("user",query_text));

  Logger.log(JSON.stringify(result));

  let data = {
    "user": { 
      "name": "user",
      "message": query_text
    }, 
    "gpt": {
      "chat_id": result.id,
      "message": result.choices[0].message.content,
      "role": result.choices[0].message.role
    }
  }
  Spreadsheet.writeGptResponse("GptMessages",data);

  let writeResult = Spreadsheet.writeGptResponse(user.username,data);

  if(writeResult == "user not found"){
    Spreadsheet.createSheet(user.username);
    Spreadsheet.writeGptResponse(user.username,data);
  }

  return data.gpt.message;

}

function FileHandler(chatId,document){
  TelegramApi.sendMessage(chatId,`URL файла: ${FileWorker.saveFile(document)}`);
}
