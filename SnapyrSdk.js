function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

import { orgId, workspaceId, userId, endpoint } from './vars';

export const track = (eventName, properties) => {

  const now = new Date().toISOString();

  const eventToSend = {
    "messageId": uuidv4(),
    "sentAt": now,
    "batch": [
      {
        "type": "track",
        "messageId": uuidv4(),
        "userId": userId,
        "event": eventName,
        "timestamp": now,
        "context": {
          "library": {
            "name": "slot-machine"
          }
        },
        "properties": Object.assign({}, {
          "orgId": orgId,
          "workspaceId": workspaceId
        }, properties)
      }
    ]
  };

  fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(eventToSend)
  });

};