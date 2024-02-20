function Handler(message) {

  switch(message.text)
  {
    case "/start":
       SendMessage(message.chat.id,`Hello, ${message.from.first_name}`);
      break;
    case "/sticker":
      SendSticker(message.chat.id, STICKERS[getRandomNumber(0,STICKERS.length - 1)]);
      break;
    case "/photo":
      SendPhoto(message.chat.id,PHOTOS[getRandomNumber(0,PHOTOS.length - 1)]);
      break;
    case "/text":
      SendMessage(message.chat.id,TEXTS[getRandomNumber(0,PHOTOS.length - 1)]);
      break;
    default:
      SendMessage(message.chat.id,"Неизвестная команда. Повторите попытку.");
      break;
  }
}
