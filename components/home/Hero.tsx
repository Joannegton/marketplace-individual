type Props = {
  storeName?: string;
};

export default function Hero({ storeName }: Readonly<Props>) {
  const title = storeName
    ? `${storeName} - Chocotones`
    : "Chocotones Irresistíveis";

  return (
    <section className="text-center mb-8 md:mb-12 py-3 md:py-8">
      <h2 className="text-3xl md:text-5xl font-bold text-amber-900 mb-3 md:mb-4 font-serif px-4">
        {title}
      </h2>
      <p className="text-lg md:text-xl text-orange-800 max-w-2xl mx-auto leading-relaxed px-4">
        Feitos artesanalmente com ingredientes selecionados para adoçar suas
        festas
      </p>
    </section>
  );
}
