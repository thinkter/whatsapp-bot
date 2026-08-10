# WhatsApp Web Automation Bot

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-automation-339933?logo=nodedotjs&logoColor=white)
![Puppeteer](https://img.shields.io/badge/browser-Puppeteer-40B5A4?logo=puppeteer&logoColor=white)
![Status](https://img.shields.io/badge/status-experiment-f59e0b)

A small WhatsApp Web automation experiment built with `whatsapp-web.js` and Puppeteer.

</div>

```mermaid
flowchart LR
  TERMINAL["Terminal"] --> QR["QR login"]
  QR --> CLIENT["whatsapp-web.js client"]
  CLIENT --> CHROME["Puppeteer / WhatsApp Web"]
  CHROME --> EVENTS["Messages and automation events"]
```

## Setup

```bash
npm install
node main.js
```

Scan the QR code printed in the terminal with WhatsApp's linked-devices flow. Keep the terminal session running while the bot is active.

## Dependencies

- `whatsapp-web.js` for the WhatsApp Web client.
- `puppeteer` for browser automation.
- `qrcode-terminal` for local QR rendering.
- `lodash` for utility helpers.

## Important

This is an unofficial automation experiment. Automated account behavior may violate platform rules or lead to account restrictions. Do not use it for spam, unsolicited messages, or sensitive workflows, and never commit session credentials.
