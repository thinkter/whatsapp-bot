const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
// Create a new client instance
const client = new Client();


async function getTotalEntries(url) {

  try {
    const response = await fetch(url);
    const json = await response.json();

    const totalEntries = json.data.eventSlots[0].total_entries;

    console.log("Total entries:", totalEntries);

    return totalEntries;
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}
async function getID(url) {

  try {
    const response = await fetch(url);
    const json = await response.json();

    const a = json.data.events[0].id;
    const b = json.data.events[0].name;
    // save it (example: log to console or store in a variable)
    console.log("id searched :", a);
    console.log("name searched :", b);
    return [a, b];
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}
// --- Command queue logic ---
const commandQueue = [];
let isProcessing = false;

function enqueueCommand(fn) {
  commandQueue.push(fn);
  processQueue();
}

async function processQueue() {
  if (isProcessing || commandQueue.length === 0) return;
  isProcessing = true;
  const fn = commandQueue.shift();
  await fn();
  setTimeout(() => {
    isProcessing = false;
    processQueue();
  }, 1000); // 1 second delay
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log('Client is ready!');
});

// When the client received QR-Code
client.on('qr', (qr) => {
  console.log('QR RECEIVED', qr);
  qrcode.generate(qr, { small: true });
});


// Only process one message per second, ignore all others while busy
let isMessageProcessing = false;
client.on('message_create', message => {
  if (isMessageProcessing) return; // Ignore if busy
  isMessageProcessing = true;

  enqueueCommand(async () => {
    try {
      if (message.body === '!c2c') {
        const a = await getTotalEntries("https://gravitas.vit.ac.in/api/events/a6be23db-1fd8-4a5f-825c-4a2d00a85dba");
        let b = `C2C: Total number of seats left are ${a}/1500`;
        let b2 = `C2C: Total number of entries are ${1500 - a}`;
        await client.sendMessage(message.from, b2);
        await client.sendMessage(message.from, b);
      } else if (message.body === '!ch') {
        const a = await getTotalEntries("https://gravitas.vit.ac.in/api/events/3df08aa2-22c9-42ff-8640-de501218780f");
        let b = `CRYPTICHUNT: Total number of seats left are ${a}/1000`;
        let b2 = `CRYPTICHUNT: Total number of entries are ${1000 - a}`;
        await client.sendMessage(message.from, b2);
        await client.sendMessage(message.from, b);
      } else if (message.body === '!dj') {
        const a = await getTotalEntries("https://gravitas.vit.ac.in/api/events/2fb279bf-3ec3-4ad9-a39b-5c06ea15d33f");
        let b = `DEVJAMS: Total number of seats left are ${a}/3000`;
        let b2 = `DEVJAMS: Total number of entries are ${3000 - a}`;
        await client.sendMessage(message.from, b2);
        await client.sendMessage(message.from, b);
      } else if (message.body.startsWith("!search")) {
        let query = message.body.replace("!search", "").trim();
        const [e,f] = await getID(`https://gravitas.vit.ac.in/api/events?name=${query}`);
        const c = await getTotalEntries(`https://gravitas.vit.ac.in/api/events/${e}`);
        let b = `${f}: Total number of seats left are ${c}`;
        // let b2 = `DEVJAMS: Total number of entries are ${3000 - a}`;
        // await client.sendMessage(message.from, b2);
        await client.sendMessage(message.from, b);
      } else if (message.body === '!help') {
        await client.sendMessage(message.from, "cmds are: !c2c, !ch, !dj, !search <query>");
      } else if (message.body === '!ashman') {
        let contact = await message.getContact();
        let name = contact.name;
        await client.sendMessage(message.from, `sybau ${name}`);
      }
    } catch (err) {
      console.error('Error in command handler:', err);
      try {
        await client.sendMessage(message.from, 'smth went wrong gng');
      } catch (sendErr) {
        console.error('Error sending error message:', sendErr);
      }
    } finally {
      // After 1 second, allow next message
      setTimeout(() => {
        isMessageProcessing = false;
      }, 100);
    }
  });
});

// Start your client
client.initialize();

