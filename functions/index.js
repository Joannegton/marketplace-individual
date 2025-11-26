const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();

const WHATSAPP_TOKEN =
  (functions.config() &&
    functions.config().whatsapp &&
    functions.config().whatsapp.token) ||
  process.env.WHATSAPP_TOKEN;

if (!WHATSAPP_TOKEN) {
  console.warn(
    "WhatsApp config incomplete. Set functions config whatsapp.token, whatsapp.phone_id and whatsapp.owner_phone"
  );
}

exports.sendOrderWhatsapp = functions.firestore
  .document("orders/{orderId}")
  .onCreate(async (snap, context) => {
    const order = snap.data();
    if (!order) return null;

    // build message
    let text = "🍫 NOVO PEDIDO DE CHOCOTONE 🍫\n\n";
    if (Array.isArray(order.items)) {
      for (const i of order.items) {
        text += `• ${i.quantity}x ${i.name} - R$ ${Number(
          i.price * i.quantity
        ).toFixed(2)}\n`;
      }
    }
    text += `\nTotal: R$ ${Number(order.total).toFixed(2)}\n\n`;
    if (order.customer) {
      text += `Nome: ${order.customer.name || "-"}\n`;
      text += `WhatsApp: ${order.customer.whatsapp || "-"}\n`;
      text += `Localização: ${order.customer.location || "-"}\n`;
    }

    if (!WHATSAPP_TOKEN) {
      await snap.ref.update({
        notified: false,
        whatsappResponse: { error: "config_missing" },
      });
      console.warn("Skipped sending WhatsApp: missing config");
      return null;
    }

    const url = `https://graph.facebook.com/v22.0/916095078255557/messages`;
    const body = {
      messaging_product: "whatsapp",
      to: "5511970179936",
      type: "text",
      text: { body: text },
    };

    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        },
        body: JSON.stringify(body),
      });

      const data = await resp.json();
      console.log("WhatsApp send response:", data);

      // update order doc with notification result
      await snap.ref.update({ notified: true, whatsappResponse: data });
      return data;
    } catch (err) {
      console.error("Error sending WhatsApp:", err);
      await snap.ref.update({
        notified: false,
        whatsappResponse: { error: String(err) },
      });
      return null;
    }
  });
