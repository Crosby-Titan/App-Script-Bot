//Methods and api key
const API_METHODS = {sendMessage : "sendMessage",sendPhoto: "sendPhoto",getMe: "getMe",sendSticker: "sendSticker"};
const API_TOKEN_ID = "12oIFj2wPetUBNcV2zTexBEZKuJZjwsKVAOVmik-0nFo";
const BOT_TOKEN = LoadData(API_TOKEN_ID);
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/`;

//https://api.telegram.org/botYOUR-TOKEN/setWebhook?url=

//Current spreadsheet
const CURRENT_SPREAD_SHEET = SpreadsheetApp.getActiveSpreadsheet();
//Data for bot
const STICKERS_URL_ID = "15xFbt2xWFIJeErXI5AwTIWPNNfXsmYER_xljk9gTWcI";
const PHOTOS_URL_ID = "1eqosh8-sCsG0SteBokSXy9RnlqfhJAlxvvFnHVJ0hQ4";
const TEXTS_ID = "1lmlzvUHFBCW1pUcxisVZIwpWJftgl8X4uMxVOEeQPpY";
const STICKERS = Array.from(JSON.parse(LoadData(STICKERS_URL_ID)).links);
const PHOTOS =  Array.from(JSON.parse(LoadData(PHOTOS_URL_ID)).links);
const TEXTS = Array.from(JSON.parse(LoadData(TEXTS_ID)).texts);
//
