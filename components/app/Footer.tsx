import React from "react";

export default function Footer() {
  return (
    <footer className="bg-linear-to-r from-amber-900 to-orange-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-amber-100 text-sm md:text-base">
          🍫 Chocotones Artesanais - Feitos com amor
        </p>
        <p className="text-xs md:text-sm text-amber-200 mt-3">
          Criado por{" "}
          <a
            href="https://www.instagram.com/joanne_gton/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Joannegtton
          </a>
        </p>
      </div>
    </footer>
  );
}
