import DataStorage from '../DataStorage.js';
import WebSocket from 'ws';
import { handleMessage } from '../functions.js';
import assert from 'assert';

describe('DataStorage', function () {
  describe('.update', function () {
    it('updates data properly', function () {
      const initialData = {
        checkbox1: {
          type: "checkbox",
          state: [
            {
              value: "1",
              checked: false
            },
            {
              value: "2",
              checked: false
            }
          ]
        },
        checkbox2: {
          type: "checkbox",
          state: [
            {
              value: "a",
              checked: false
            },
            {
              value: "b",
              checked: false
            }
          ]
        }
      };

      const updateObject = {
        checkbox2: {
          type: "checkbox",
          state: [
            {
              value: "a",
              checked: true // change here
            },
            {
              value: "b",
              checked: false
            }
          ]
        }
      };

      const expectedDataAfterUpdate = {
        checkbox1: {
          type: "checkbox",
          state: [
            {
              value: "1",
              checked: false
            },
            {
              value: "2",
              checked: false
            }
          ]
        },
        checkbox2: {
          type: "checkbox",
          state: [
            {
              value: "a",
              checked: true // change here
            },
            {
              value: "b",
              checked: false
            }
          ]
        }
      };

      const storage = new DataStorage(initialData);
      storage.update(updateObject);

      assert.deepStrictEqual(storage.state, expectedDataAfterUpdate);
    });
  });
});

describe("function", () => {
  describe("handleMessage", () => {
    const mockSender = {
      data: null,
      send: function (data) {
        this.data = data;
      }
    };

    const mockClient = {
      ...mockSender,
      readyState: WebSocket.OPEN
    };

    const mockServer = {
      clients: [
        mockClient
      ]
    };

    const mockDataStorage = {
      data: null,
      update: function (data) {
        this.data = data;
      }
    };

    it("properly processes CHANGE type message", () => {
      const incomingMessage = {
        type: "CHANGE",
        payload: "My incoming data"
      };

      handleMessage(incomingMessage, mockSender, mockServer, mockDataStorage);

      assert.strictEqual(mockSender.data, null);
      assert.deepStrictEqual(mockClient.data, JSON.stringify({ type: "UPDATE", payload: incomingMessage.payload }));
      assert.strictEqual(mockDataStorage.data, incomingMessage.payload);
    });

    it('doesn\'t recognize other message types', () => {
      const incomingMessage = {
        type: "DIFFERENT_TYPE",
        payload: "Whatever"
      };

      assert.throws(() => { handleMessage(incomingMessage, mockSender, mockServer, mockDataStorage); }, "Unknown message type: DIFFERENT TYPE")
    });
  });
});