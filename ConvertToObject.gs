function GetUpdate(parsedData){
  return {
    "update_id": parsedData.update_id,
    "message": GetMessage(parsedData.message)
  }
}

function GetMessage(message){
  return {
    "message_id": message.message_id,
    "from": GetUser(message.from),
    "date": new Date(),
    "chat": GetChat(message.chat),
    "text": message.text
  }
}

function GetUser(user){
  return {
    "id": user.id,
    "is_bot": user.is_bot,
    "first_name": user.first_name,
    "username": user.username
  }
}

function GetChat(chat){
  return {
    "id": chat.id,
    "type": chat.type,
    "title": chat.title,
    "username": chat.username
  }
}
