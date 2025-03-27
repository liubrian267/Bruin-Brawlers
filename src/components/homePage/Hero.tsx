import Link from "next/link";

export default function Hero() {
  return (
    <section className="text-center py-20">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
        Welcome to Bruin Brawlers
      </h1>
      <p className="text-xl md:text-2xl text-white mb-8">
        The ultimate platform for UCLA&apos;s Brawl Stars community
      </p>
      <Link
        href="/signUp"
        className="bg-ucla-gold text-ucla-blue font-bold py-3 px-6 rounded-full text-lg hover:bg-yellow-400 transition duration-300"
      >
        Join the Brawl
      </Link>
    </section>
  );
}
