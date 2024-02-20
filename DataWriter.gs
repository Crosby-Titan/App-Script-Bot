function WriteToSheet(data){
  let sheet = CURRENT_SPREAD_SHEET.getSheetByName("Messages");

  let availableRow = sheet.getLastRow() + 1;

  sheet.getRange(`A${availableRow}:C${availableRow}`).setValues([
    [data.date,data.from.username,data.text]
  ]);
}
