"use client";

import React, { useState } from "react";

const WhatsAppFloating: React.FC<{ message?: string }> = ({
  message = "Olá, gostaria informações sobre os chocotones!",
}) => {
  const [imgError, setImgError] = useState(false);
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const text = encodeURIComponent(message);
  const href = `https://wa.me/${number}?text=${text}`;

  const size = 56;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir WhatsApp"
      style={{
        position: "fixed",
        right: 20,
        bottom: 24,
        width: size,
        height: size,
        borderRadius: size / 2,
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 6px 18px rgba(37,211,102,0.18)",
        zIndex: 60,
      }}
    >
      {imgError ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M20.52 3.48A11.86 11.86 0 0012 0C5.37 0 .02 5.35 0 12c0 2.11.55 4.18 1.6 6.02L0 24l6.2-1.62A11.93 11.93 0 0012 24c6.63 0 11.99-5.37 12-12 0-1.98-.49-3.9-1.48-5.7z"
            fill="#25D366"
          />
          <path
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.149-.672.15s-.771.967-.947 1.168c-.174.199-.347.223-.644.075-1.758-.867-2.906-1.54-4.074-3.48-.307-.53.307-.49.88-1.62.099-.199 0-.373-.05-.522-.05-.149-.672-1.612-.921-2.214-.243-.58-.49-.5-.672-.51l-.573-.01c-.199 0-.522.075-.797.373s-1.04 1.016-1.04 2.479c0 1.462 1.064 2.875 1.212 3.074.149.199 2.095 3.2 5.077 4.487 2.982 1.289 2.982.86 3.52.807.538-.05 1.758-.719 2.005-1.413.248-.695.248-1.289.174-1.414-.074-.124-.273-.199-.57-.347z"
            fill="#fff"
          />
        </svg>
      ) : (
        <img
          src="/whatsapp.png"
          alt="WhatsApp"
          width={40}
          height={40}
          style={{ display: "block", borderRadius: 8 }}
          onError={() => setImgError(true)}
        />
      )}
    </a>
  );
};

export default WhatsAppFloating;
