/**
 * @type {{id: number, response: Response}[]}
 */
let clients = [];
let currClientId = 0;

/**
 * @param {string} event the event to send
 * @param {any} data data of the event
 * @returns void
 */
const sendSSE = (event, data) => {
  clients.forEach((client) =>
    client.response.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
  );
};

module.exports = { clients, currClientId, sendSSE };
