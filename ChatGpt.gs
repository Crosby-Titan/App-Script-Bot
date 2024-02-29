class GptClient{
  constructor(apiKey,requestUrl, model){
    
    this.messages = [];
    this.model = model;
    this.url = requestUrl;
    this.fetch = function(url,data){
      return UrlFetchApp.fetch(url,{
        "method": "post",
        "headers": {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        "payload": JSON.stringify(data),
        "muteHttpExceptions": true
      })
    }

    this.sendRequest = function(message){
      this.messages.push(message);
      
      this.messages = this.messages.filter(val => val !== null);

      let data = JSON.parse(this.fetch(this.url,new GptRequest(this.model,this.messages)).getContentText());

      Logger.log(data);

      let response = GptResponse.createFrom(data);

      return response;
    }

    this.sendRequestAsync = async function(message){
      return await Promise.resolve(this.sendRequest(message))
    }

  }
}

class GptMessage{
  constructor(role,content){
    this.role = role;
    this.content = content;
  }
}

class GptRequest{
  constructor(model,messages){
    this.messages = Array.from(messages);
    this.model = model;
  }
}

class Choice{
  constructor(index,message,finish_reason){
    this.index = index;
    this.message = message;
    this.finish_reason = finish_reason;
  }

  static createFrom(json){

    let data = (typeof json == "object") ? json : JSON.parse(json);

    return new Choice(data.index,new GptMessage(data.message.role,data.message.content),data.finish_reason);
  }
}

class GptResponse{
  constructor(id,object,created,choices){
    this.id = id;
    this.object = object;
    this.created = created;
    this.choices = Array.from(choices);
    
    for(let i = 0;i < this.choices.length;i++)
      this.choices[i] = Choice.createFrom(this.choices[i]);
    
  }

  static createFrom(json){

    let data = (typeof json == "object") ? json : JSON.parse(json);

    return new GptResponse(data.id,json.object,data.created,data.choices);
  }
}
