import { Trophy } from "lucide-react";

export default function Header() {
  return (
    <header className="text-center">
      <div className="flex items-center justify-center">
        <Trophy className="w-12 h-12 text-yellow-400 mr-2" />
        <h1 className="text-4xl font-bold text-white">Bruin Brawlers</h1>
      </div>
      <p className="mt-2 text-xl text-white">
        UCLA&apos;s Brawl Stars Community
      </p>
    </header>
  );
}
