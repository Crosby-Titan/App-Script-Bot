class Update{
  constructor(update_id){
    this.update_id = update_id;
    this.callback_query = null;
    this.message = null;
  }

  static createFrom(json){
    let obj = new Update(json.update_id);

    obj.callback_query = ("callback_query" in json) ? CallbackQuery.createFrom(json.callback_query) : null;
    obj.message = ("callback_query" in json) ? Message.createFrom(json.callback_query.message) : Message.createFrom(json.message);

    return obj;
  }
  
}

class Chat{
  constructor(chatid){
    this.id = chatid;
    this.type = null;
    this.title = null;
    this.username = null;
  }

  static createFrom(json){
    let obj = new Chat(json.id);

    obj.type = json.type;
    obj.title = json.title;
    obj.username = json.username;

    return obj;
  }
}

class Message{
  constructor(message_id,chat){
      this.message_id = message_id;
      this.from = null;
      this.date = null;
      this.chat = chat;
      this.text = null;
      this.document = null;
      this.reply_markup = null;
    }

    static createFrom(json){
      let obj = new Message(json.message_id,Chat.createFrom(json.chat));
      obj.from = User.createFrom(json.from);
      obj.date = new Date();
      obj.text = json.text;
      obj.document = ("document" in json) ? Document.createFrom(json.document) : null;
      obj.reply_markup = ("reply_markup" in json) ? KeyboardMarkup.createInlineKeyboard(json.reply_markup) : null;

      return obj;
    }
}

class User{
  constructor(userid,is_bot,first_name,username){
    this.id = userid;
    this.is_bot = is_bot;
    this.first_name = first_name;
    this.username = username;
  }

  static createFrom(json){
    return new User(json.id,json.is_bot,json.first_name,json.username);
  }
}

class KeyboardMarkup{

  static createInlineKeyboard(arrayOfbutton){
    return {
    "inline_keyboard": Array.from(arrayOfbutton)
    }
  }

  static createInlineButton(text,data){
    return {
    "text": text,
    "callback_data": data
    }
  }

  static createUrlInlineButton(text,url){
    return {
    "text": text,
    "url": url
    }
  }
}

class CallbackQuery{
  constructor(query_id,chat_instance,from){
    this.id = query_id;
    this.chat_instance = chat_instance;
    this.from = from;
    this.data = null;
  }

  static createFrom(json){
    let obj = new CallbackQuery(json.id,json.chat_instance,User.createFrom(json.from));

    obj.data = json.data;

    return obj;
  }

}

class Document{
  constructor(file_id,file_unique_id){
    this.file_id = file_id;
    this.file_unique_id = file_unique_id;
    this.mime_type = null;
    this.file_size = null;
  }

  static createFrom(json){
    let obj = new Document(json.file_id,json.file_unique_id);

    obj.mimeType = json.mime_type;
    obj.file_size = json.file_size;

    return obj;
  }
}

class File{
  constructor(file_id,file_unique_id){
    this.file_id = file_id;
    this.file_unique_id = file_unique_id;
    this.file_path = null;
    this.file_size = null;
  }

  static createFrom(json){
    let obj = new File(json.file_id,json.file_unique_id);

    obj.file_path = json.file_path;
    obj.file_size = json.file_size;

    return obj;
  }
}
//`https://www.cbr-xml-daily.ru/daily_json.js`
class CurrencyRate{
  constructor(fetchFrom){
    this.url = fetchFrom;
    this.currencies = {};
  }

  async GetCurrencyRate() {
    return await ((async ()=>{
      const result = JSON.parse(UrlFetchApp.fetch(this.url).getContentText());

      for(let i = 0; i < SUPPORTED_CURRENCIES.length;i++){

        if(!(SUPPORTED_CURRENCIES[i].code in result.Valute))
          continue;

        const name = result.Valute[SUPPORTED_CURRENCIES[i].code].CharCode;
        const id =  result.Valute[SUPPORTED_CURRENCIES[i].code].ID;
        const value = result.Valute[SUPPORTED_CURRENCIES[i].code].Value;
        this.currencies[SUPPORTED_CURRENCIES[i].code] = new Currency(name,id,value,SUPPORTED_CURRENCIES[i].charFlag);
      }

      return this.currencies;

  })());
  }

  toHtmlString() {
    let str = `<pre>Курс валют на ${new Date().toLocaleDateString()} \n`;

    for(let i = 0;i < SUPPORTED_CURRENCIES.length;i++){

      if(!(SUPPORTED_CURRENCIES[i].code in this.currencies))
        continue;

      str += this.currencies[SUPPORTED_CURRENCIES[i].code].toHtmlString() + "\n" ;
    }

    return (str + "</pre>");
  }
}

class Currency{
  constructor(currency_name,currency_id,currency_value,country_flag){
    this.name = currency_name;
    this.flag = country_flag;
    this.id = currency_id;
    this.value = currency_value;
    this.toString = function(){ return `Валюта: ${this.name}${this.flag} Значение: ${this.value}`; }
    this.toHtmlString = function(){ return `<b>Валюта:</b><code>${this.name}</code>${this.flag}<b>Значение: </b><code>${this.value}</code>`; }
  }
}

class DataLoader{

  static load(fileId) {
    let document = DocumentApp.openById(fileId);

    return document.getBody().getText();
  }
}

class Spreadsheet{
  static write(data){
    let sheet = CURRENT_SPREAD_SHEET.getSheetByName("Messages");

    let availableRow = sheet.getLastRow() + 1;

    sheet.getRange(`A${availableRow}:C${availableRow}`).setValues([
      [data.date,data.from.username,data.text]
    ]);
  }

  static createSheet(name){
    CURRENT_SPREAD_SHEET.insertSheet(String(name));
  }

  static writeGptResponse(sheetName,data){
    let sheet = CURRENT_SPREAD_SHEET.getSheetByName(sheetName);

    if(sheet == null)
      return "user not found";

    sheet.appendRow([data.user.name,data.user.message,data.gpt.role,data.gpt.message,data.gpt.chat_id])

    return "success"
  }
}

class UserHelper{
  constructor(sheetname){
    this.isUserExists = function(username){ 
      let sheet = CURRENT_SPREAD_SHEET.getSheetByName(sheetname);

      let data = sheet.getRange('B:B').getValues();
      for(let i = 0;i < data.length;i++){
        for(let j = 0;j < data[i].length;j++){
          if(data[i][j] == username){
            return true;
          }
        }
      }

      return false;
      
    }

    this.getUserStatus = function(username){
      let sheet = CURRENT_SPREAD_SHEET.getSheetByName(sheetname);
      
      let data = sheet.getRange('B:B').getValues();
      for(let i = 0;i < data.length;i++){
        for(let j = 0;j < data[i].length;j++){
          if(data[i][j] == username){
            return sheet.getRange(`C${i + 1}`).getValue();
          }
        }
      }

      return null;
    }

    this.setUserStatus = function(username,status){
      let sheet = CURRENT_SPREAD_SHEET.getSheetByName(sheetname);
  
      Logger.log(username + ' ' + sheetname);

      let data = sheet.getRange('B:B').getValues();
      for(let i = 0;i < data.length;i++){
        for(let j = 0;j < data[i].length;j++){
          if(data[i][j] == username){
            sheet.getRange(`C${i + 1}`).setValue(status);
            return;
          }
        }
      }
    }

    this.appendNewUser = function(chatId,username){
      let sheet = CURRENT_SPREAD_SHEET.getSheetByName(sheetname);

      if(this.isUserExists(username))
        return;
      
      sheet.appendRow([chatId,username]);
    }
  }
}

class FileWorker{
  static saveFile(document) {//информация о содержимом документа: https://core.telegram.org/bots/api#document

    let saveFolder = DriveApp.getFolderById(FOLDER_ID);//получаем папку

    let response = UrlFetchApp.fetch(REQUEST_LINK + `${API_METHODS.getFile}?file_id=${document.file_id}`);//запрос на получение информации

    let file = JSON.parse(response.getContentText()).result;//получаем информацию о файле
    let url = DOWNLOAD_LINK + file.file_path;//формируем ссылку для загрузки

    let downloadedFile = UrlFetchApp.fetch(url).getBlob();//загружаем файл

    saveFolder.createFile(downloadedFile).setName(`${file.file_id}`);//сохраняем на диске

    Logger.log(url);

    return url;//возвращаем ссылку
  }
}

class Random{
  static getRandomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static getRandom(){
    return Random.getRandomBetween(Number.MIN_VALUE,Number.MAX_VALUE);
  }
}

class TelegramApi{
  static sendMessage(chatId,text){
    return TelegramApi.useMethod(API_METHODS.sendMessage,{"chat_id": chatId, "text": text});
  }

 static sendMessageWithParseMode(chatId,text,parseMode){
    return TelegramApi.useMethod(API_METHODS.sendMessage,{"chat_id": chatId, "text": text,"parse_mode": parseMode});
  }

 static sendMessageWithReplyMarkup(chatId,text,reply_markup){
    return TelegramApi.useMethod(API_METHODS.sendMessage,{"chat_id": chatId, "text": text,"reply_markup": JSON.stringify  (reply_markup)});
  }

 static sendPhotoWithReplyMarkup(chatId,photoUrl,text,reply_markup){
    return TelegramApi.useMethod(API_METHODS.sendPhoto,{"chat_id": chatId,"photo":photoUrl,"caption": text,"reply_markup": JSON.stringify(reply_markup)})
  }

 static sendPhoto(chatId,photoUrl){
    return TelegramApi.useMethod(API_METHODS.sendPhoto,{"chat_id": chatId, "photo": photoUrl});
  }

 static sendSticker(chatId,stickerUrl){
    return TelegramApi.useMethod(API_METHODS.sendSticker,{"chat_id": chatId, "sticker": stickerUrl});
  }

 static resetButtonStatus(callback_id) {
    return UrlFetchApp.fetch(API_URL + `${API_METHODS.answerCallbackQuery}`,{
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify({
        "callback_query_id": callback_id
      })
    });
  }

 static useMethod(apiMethod,data){

    return UrlFetchApp.fetch(API_URL + apiMethod,{
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify(data)
    });

  }
}
