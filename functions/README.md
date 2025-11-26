# sendOrderWhatsapp (Cloud Function)

This folder contains a Firebase Cloud Function that triggers when a new document is created in the `orders` collection and sends a WhatsApp message to the owner automatically using the WhatsApp Cloud API.

Setup

1. Install dependencies:

```bash
cd functions
npm install
```

2. Configure credentials (recommended using `functions.config`):

```bash
firebase functions:config:set whatsapp.token="YOUR_WHATSAPP_TOKEN" whatsapp.phone_id="YOUR_PHONE_ID" whatsapp.owner_phone="5511999999999"
```

3. Deploy only the function:

```bash
cd functions
npm run deploy
```

Notes

- Ensure the WhatsApp Cloud API credentials are valid (token and phone id).
- This example uses the REST WhatsApp Cloud API (Meta). You can adapt it to Twilio or another provider.
- The function updates the created `orders/{id}` document with fields `notified` and `whatsappResponse` containing the provider response.

Security

- Keep tokens secret. Use `firebase functions:config:set` or secret manager.
- Be mindful of message rate limits and costs.
