// Fallback storage for last known values
let lastC2C = null;
let lastCH = null;
let lastDJ = null;
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
// Create a new client instance
const client = new Client();

// const client = new Client({
//   puppeteer: {
//     executablePath: '/usr/bin/chromium-browser',
//     headless: true, // optional
//     args: ['--no-sandbox', '--disable-setuid-sandbox'] // recommended for Linux servers
//   }
// });

async function getTotalEntries(url) {
  // Timeout logic: reject if fetch+parse takes longer than 5 seconds
  const timeoutMs = 5000;
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out after 5 seconds')), timeoutMs)
  );
  try {
    const fetchPromise = (async () => {
      const response = await fetch(url);
      const json = await response.json();
      const totalEntries = json.data.eventSlots[0].total_entries;
      console.log("Total entries:", totalEntries);
      return totalEntries;
    })();
    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch (err) {
    console.error("Error fetching data:", err);
    throw err;
  }
}
async function getID(url) {
  // Timeout logic: reject if fetch+parse takes longer than 5 seconds
  const timeoutMs = 5000;
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out after 5 seconds')), timeoutMs)
  );
  try {
    const fetchPromise = (async () => {
      const response = await fetch(url);
      const json = await response.json();
      const a = json.data.events[0].id;
      const b = json.data.events[0].name;
      // save it (example: log to console or store in a variable)
      console.log("id searched :", a);
      console.log("name searched :", b);
      return [a, b];
    })();
    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch (err) {
    console.error("Error fetching data:", err);
    throw err;
  }
}
// --- Command queue logic removed ---

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log('Client is ready!');
});

// When the client received QR-Code
client.on('qr', (qr) => {
  console.log('QR RECEIVED', qr);
  qrcode.generate(qr, { small: true });
});


client.on('message_create', async message => {
  try {
    if (message.body === '!c2c') {
      let a;
      try {
        a = await getTotalEntries("https://gravitas.vit.ac.in/api/events/a6be23db-1fd8-4a5f-825c-4a2d00a85dba");
        if (typeof a === 'number') lastC2C = a;
      } catch (e) {
        a = lastC2C;
      }
      if (a == null) {
        await client.sendMessage(message.from, 'C2C: Unable to fetch or fallback to last known value.');
      } else {
        let b = `C2C: Total number of seats left are ${a}/1500`;
        let b2 = `C2C: Total number of entries are ${1500 - a}`;
        await client.sendMessage(message.from, b2);
        await client.sendMessage(message.from, b);
      }
    } else if (message.body === '!ch') {
      let a;
      try {
        a = await getTotalEntries("https://gravitas.vit.ac.in/api/events/3df08aa2-22c9-42ff-8640-de501218780f");
        if (typeof a === 'number') lastCH = a;
      } catch (e) {
        a = lastCH;
      }
      if (a == null) {
        await client.sendMessage(message.from, 'CRYPTICHUNT: Unable to fetch or fallback to last known value.');
      } else {
        let b = `CRYPTICHUNT: Total number of seats left are ${a}/1000`;
        let b2 = `CRYPTICHUNT: Total number of entries are ${1000 - a}`;
        await client.sendMessage(message.from, b2);
        await client.sendMessage(message.from, b);
      }
    } else if (message.body === '!dj') {
      let a;
      try {
        a = await getTotalEntries("https://gravitas.vit.ac.in/api/events/2fb279bf-3ec3-4ad9-a39b-5c06ea15d33f");
        if (typeof a === 'number') lastDJ = a;
      } catch (e) {
        a = lastDJ;
      }
      if (a == null) {
        await client.sendMessage(message.from, 'DEVJAMS: Unable to fetch or fallback to last known value.');
      } else {
        let b = `DEVJAMS: Total number of seats left are ${a}/3000`;
        let b2 = `DEVJAMS: Total number of entries are ${3000 - a}`;
        await client.sendMessage(message.from, b2);
        await client.sendMessage(message.from, b);
      }
    } else if (message.body.startsWith("!search")) {
      let query = message.body.replace("!search", "").trim();
      const [e,f] = await getID(`https://gravitas.vit.ac.in/api/events?name=${query}`);
      const c = await getTotalEntries(`https://gravitas.vit.ac.in/api/events/${e}`);
      let b = `${f}: Total number of seats left are ${c}`;
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
  }
});

// Start your client
client.initialize();

