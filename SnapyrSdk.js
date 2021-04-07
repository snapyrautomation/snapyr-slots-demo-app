function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

import { sdkWriteKey, channelId, userId, endpoint } from './vars';

const Buffer = require('buffer').Buffer;

export const track = (eventName, properties) => {
  const now = new Date().toISOString();

  const eventToSend = {
    messageId: uuidv4(),
    sentAt: now,
    batch: [
      {
        type: 'track',
        messageId: uuidv4(),
        userId: userId,
        event: eventName,
        timestamp: now,
        context: {
          library: {
            name: 'slot-machine',
          },
          sdkMeta: {
            channelId
          }
        },
        properties: Object.assign({}, properties),
      },
    ],
  };

  fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' + new Buffer(sdkWriteKey + ':').toString('base64'),
    },
    body: JSON.stringify(eventToSend),
  }).then((response) => {
    console.log('status', response.status);
    // response.text().then(text => console.log(text));
    response.json().then(json => {
      if (Array.isArray(json) && json.length > 0 && 'actions' in json[0] && Array.isArray(json[0].actions) && json[0].actions.length > 0) {
        setTimeout(() => {
          alert('Snapyr says: It\'s OK, keep trying!');
        }, 2200);
      }
    });
  });
};
