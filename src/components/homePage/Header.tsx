import Link from "next/link"
import { Trophy } from "lucide-react"

export default function Header() {
  return (
    <header className="flex justify-between items-center py-4">
      <div className="flex items-center">
        <Trophy className="w-10 h-10 text-ucla-gold mr-2" />
        <h1 className="text-2xl font-bold text-white">Bruin Brawlers</h1>
      </div>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/about" className="text-white hover:text-ucla-gold">
              About
            </Link>
          </li>
          <li>
            <Link href="/tournaments" className="text-white hover:text-ucla-gold">
              Tournaments
            </Link>
          </li>
          <li>
            <Link href="/login" className="text-white hover:text-ucla-gold">
              Log In
            </Link>
          </li>
          <li>
            <Link
              href="/signUp"
              className="bg-ucla-gold text-ucla-blue px-4 py-2 rounded-full hover:bg-yellow-400 transition duration-300"
            >
              Sign Up
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
