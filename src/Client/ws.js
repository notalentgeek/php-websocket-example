var CSS_ID = Object.freeze({
  CLIENT_BUTTON_: "client-button-",
  MAIN_BUTTON_CONTAINER: 'main-button-container',
  WS_EVENT: 'ws-event',
  WS_ID: 'ws-id'
});

var DOM_STRING_FUNCTION = Object.freeze({
  MessageButton: function (cssID, targetResourceID) {
    return "<button " +
      "class='width-4th' " +
      "id=" + cssID + " " +
      "onclick='WS_EVENT_SEND.SendPersonalMessage(" + targetResourceID +
        ")'" +
    ">" +
      "send pm to " + targetResourceID +
    "</button>"
  }
});

var KEY = Object.freeze({
  EVENT_NAME: 'eventName',
  VALUE: 'value'
});

var WS_EVENT = Object.freeze({
  BROADCAST_MESSAGE_TO_ALL_CLIENTS: 'broadcastMessageToAllClients',
  QUITED_CLIENT: "quitedClient",
  RECEIVE_MESSAGE: "receiveMessage",
  REQUEST_ID: 'requestID',
  SEND_PERSONAL_MESSAGE: "sendPersonalMessage"
});

var clientProps = {
  resourceID: undefined
};

// Establish WebSocket connection
var wsConnection = new WebSocket('ws://localhost:8080');

var WS_EVENT_RECEIVE = Object.freeze({
  QuitedClient: function (data) {
    $("#" + CSS_ID.CLIENT_BUTTON_ + data[KEY.VALUE]).remove();
  },
  ReceiveMessage: function (data) {
    /*
    Add private message (PM) button for every received message
    Only add the button if the button does not exists yet
    */
    if (!$("#" + CSS_ID.CLIENT_BUTTON_ + data[KEY.VALUE]).length) {
      $('#' + CSS_ID.MAIN_BUTTON_CONTAINER).append(
        DOM_STRING_FUNCTION.MessageButton(
          CSS_ID.CLIENT_BUTTON_ + data[KEY.VALUE],
          data[KEY.VALUE]
        )
      );
    }
  },
  RequestID: function (data) {
    // Set client properties
    clientProps.resourceID = data[KEY.VALUE];

    // Set view
    $('#' + CSS_ID.WS_ID).html("id: " + clientProps.resourceID);
  }
});

var WS_EVENT_SEND = Object.freeze({
  BroadcastMessageToAllClients: function () {
    var dict = {};
    dict[KEY.EVENT_NAME] = WS_EVENT.BROADCAST_MESSAGE_TO_ALL_CLIENTS;
    dict = JSON.stringify(dict);

    wsConnection.send(dict);
  },
  RequestID: function () {
    var dict = {};
    dict[KEY.EVENT_NAME] = WS_EVENT.REQUEST_ID;
    dict = JSON.stringify(dict);

    wsConnection.send(dict);
  },
  SendPersonalMessage: function (resourceID) {
    var dict = {};
    dict[KEY.EVENT_NAME] = WS_EVENT.SEND_PERSONAL_MESSAGE;
    dict[KEY.VALUE] = resourceID
    dict = JSON.stringify(dict);

    wsConnection.send(dict);
  }
});

wsConnection.onopen = function(e) {
  console.log('connection established');

  WS_EVENT_SEND.RequestID();
};

wsConnection.onmessage = function(e) {
  console.log('received message from server: ' + e.data);
  $('#' + CSS_ID.WS_EVENT).html("received message from server:<br />" + e.data);

  // Parse string received from server, because it needs to be in JSON
  var data = JSON.parse(e.data);

  if (data[KEY.EVENT_NAME] === WS_EVENT.QUITED_CLIENT) {
    WS_EVENT_RECEIVE.QuitedClient(data);
  }
  else if (data[KEY.EVENT_NAME] === WS_EVENT.RECEIVE_MESSAGE) {
    WS_EVENT_RECEIVE.ReceiveMessage(data);
  }
  else if (data[KEY.EVENT_NAME] === WS_EVENT.REQUEST_ID) {
    WS_EVENT_RECEIVE.RequestID(data);
  }
};