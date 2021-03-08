'use strict';

// Imports dependencies and set up http server
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

//Link de Acceso de Token page
const PAGE_ACCESS_TOKEN = 'EAAZAYdxBOxYMBAJDwiHCXhYBIZCgDQFVxH8sr0aRuechTWSy7xY2J1l1LI9at6mx7ZAgCyb5hDwZAyXpOK6H1jXNhnIkr8Tywpopjupx7I5ZAfcIpek3Lg95S3ZCYLMChiXTmeibNhFj9XZBb2CMCY8z3CIW6mnuGqGDWagcgxRwv90XgDxNBrB';

//Link de Acceso de Mi token
const VERIFY_TOKEN = 'zeabotappmessenger';

const app = express().use(bodyParser.json());// creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 8085, () => console.log('webhook is listening'));

//Montrando Get
app.get('/', function (req, res) {
  res.send('Hola ChatBot ZEA!');
  console.log('GET: Webhook');
});

//Mostrando Get a Facebook
app.get("/webhook", (req, res) => {
  console.log('GET: Webhook');
  // Your verify token. Should be a random string.
  const VERIFY_TOKEN = "zeabotappmessenger";
    
  // Parse the query params
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});

//Metodo Post para 
app.post('/webhook', function (req, res) {
  console.log('POST: Webhook');
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      //Se reciben los mensajes
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      //Se recibe el identificador
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);

      //Recibir los eventos 
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);        
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }

    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('Evento Recibido');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});


// Handles messages events
function handleMessage(sender_psid, received_message) {
  let response;

  //Responde Saludos
  if(received_message.text === "Hola" || received_message.text === "Hi" || received_message.text === "Empezar" || received_message.text === "hola" || received_message.text === "Get Started"){
    response = {
      "text": `¡Hola!, Gracias por ponerte en contacto con nosotros. 🥂🍽`
    }  
  }else{//Responde cualquier saludo
    response= { 
        "attachment":{
          "type":"template",
          "payload":{
            "template_type":"generic",
            "elements":[
              {
                "title":"¿En que podemos ayudarte?",
                "image_url":"https://zea.mobi/Welcome/wp-content/uploads/2020/11/2..-1.png",
                "subtitle":"Elige tu opcion preferidad",
                "default_action": {
                  "type": "web_url",
                  "url": "https://www.facebook.com/zea.mobi",
                  "webview_height_ratio": "tall",
                },
                "buttons":[
                  {
                    "type":"web_url",
                    "title":"Sitio Web",
                    "url": "https://zea.mobi/Welcome/"
                  },{
                    "type":"postback",
                    "title":"Nuestros Servicios",
                    "payload":"services"
                  },{
                    "type":"postback",
                    "title":"Hablar con un Asistente",
                    "payload":"assistence"
                  }               
                ]      
              }
            ]
          }
        }
      }   
    }

    //Saluda Buenas noches
    if(received_message.text === "Buenas noches" || received_message.text === "Buenos días" || received_message.text === "Buenas tardes" ||received_message.text === "buenas noches" || received_message.text === "buenos días" || received_message.text === "buenas tardes" || received_message.text === "buenos dias" || received_message.text === "Buenos dias"){ 
      if(received_message.text === "Buenas noches" || received_message.text === "buenas noches"){
        response = {
          "text": `¡Buenas noches!, en que te podemos ayudar. 😊`
        }
      }else if(received_message.text === "Buenos días" || received_message.text === "buenos días" || received_message.text === "buenos dias" || received_message.text === "Buenos dias"){
        response = {
          "text": `¡Buenas días!, en que te podemos ayudar. 😉`
        }
      }else if(received_message.text === "Buenas tardes" || received_message.text === "buenas tardes"){
        response = {
          "text": `Buenas tardes, en que te podemos ayudar. 😄`
        }
      }
    } 
    //Responde a despedidas
    if(received_message.text === "Gracias" || received_message.text === "Muchas gracias" || received_message.text === "ok" ||received_message.text === "gracias" ||received_message.text === "muchas gracias" || received_message.text === "Adios" ||received_message.text === "adios" || received_message.text === "Hasta pronto" || received_message.text === "hasta pronto"){
        response = {
          "text":  `De nada, gracias por ponerte en contacto con nosotros. 🤗`
        }
    }

  callSendAPI(sender_psid,response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  let response;
  
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'assistence') {
    response = { "text": "En un momento un asistente se pondra en contacto contigo." }
  } else if (payload === 'services') {
    response = { 
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"generic",
          "elements":[
            {
              "title":"Nuestros Servicios",
              "image_url":"https://zea.mobi/Welcome/wp-content/uploads/2020/11/Dise%C3%B1o-sin-t%C3%ADtulo-4-1.png",
              "subtitle":"Elige tu opcion preferidad",
              "default_action": {
                "type": "web_url",
                "url": "https://www.facebook.com/zea.mobi",
                "webview_height_ratio": "tall",
              },
              "buttons":[
                {
                  "type":"web_url",
                  "title":"App para Usuarios",
                  "url": "https://play.google.com/store/apps/details?id=com.companyname.appreservation"
                },{
                  "type":"web_url",
                  "title":"App para Negocios",
                  "url": "https://play.google.com/store/apps/details?id=com.companyname.zea_business"
                }             
              ]      
            }
          ]
        }
      }
      }
    } 
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('Mensaje Enviado!')
    } else {
      console.error("El mensaje no se pudo enviar por:" + err);
    }
  }); 
}