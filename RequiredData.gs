//Methods and api key
const API_METHODS = {sendMessage : "sendMessage",sendPhoto: "sendPhoto",getMyName: "getMyName",sendSticker: "sendSticker",getFile: "getFile",answerCallbackQuery: "answerCallbackQuery",};
const API_TOKEN_ID = "";
const BOT_TOKEN = DataLoader.load(API_TOKEN_ID);
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/`;

//https://api.telegram.org/botYOUR-TOKEN/setWebhook?url=

//Current spreadsheet
const CURRENT_SPREAD_SHEET = SpreadsheetApp.getActiveSpreadsheet();
//Data for bot
const STICKERS_URL_ID = "";
const BUTTON_URL_ID = "";
const PHOTOS_URL_ID = "";
const TEXTS_ID = "";
const SUPPORTED_CURRENCIES_ID = "";
const SUPPORTED_CURRENCIES = Array.from((JSON.parse(DataLoader.load(SUPPORTED_CURRENCIES_ID)).currencies));
const URL_FOR_BUTTON = JSON.parse(DataLoader.load(BUTTON_URL_ID)).link;
const STICKERS = Array.from(JSON.parse(DataLoader.load(STICKERS_URL_ID)).links);
const PHOTOS =  Array.from(JSON.parse(DataLoader.load(PHOTOS_URL_ID)).links);
const TEXTS = Array.from(JSON.parse(DataLoader.load(TEXTS_ID)).texts);
const INLINE_KEYBOARD = KeyboardMarkup.createInlineKeyboard(
  [
    [KeyboardMarkup.createUrlInlineButton("Сайт для просмотра", `${URL_FOR_BUTTON}`)],
    [KeyboardMarkup.createInlineButton("Случайное фото",  "/callback_photo")],
    [KeyboardMarkup.createInlineButton("Случайная цитата",  "/callback_text")],
    [KeyboardMarkup.createInlineButton("Случайный стикер",  "/callback_sticker")],
    [KeyboardMarkup.createInlineButton("Курс валют", "/callback_currency_rate")]
  ]
  );
const MENU_PHOTO_URL = "https://w.forfun.com/fetch/e1/e19194feaeb66dcf60fef138a29d408e.jpeg?w=1470&r=0.5625";
//Data for save file
const FOLDER_ID = "";//Идентификатор папки на гугл диске
const REQUEST_LINK = `https://api.telegram.org/bot${BOT_TOKEN}/`;//ссылка для запроса данных о файле
const DOWNLOAD_LINK = `https://api.telegram.org/file/bot${BOT_TOKEN}/`;//ссылка для загрузки файла
//ChatGpt
const OPEN_AI_KEY_ID = "";
const OPEN_AI_KEY = DataLoader.load(OPEN_AI_KEY_ID);
const OPEN_AI_REQUEST_URL = "https://api.openai.com/v1/chat/completions";
const AI_MODEL = "gpt-3.5-turbo";
//
