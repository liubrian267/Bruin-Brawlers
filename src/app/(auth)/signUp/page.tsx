import SignUpForm from "@/components/auth/SignUpForm"
import Header from "@/components/auth/Header"

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-ucla-blue to-ucla-gold"></div>
      <div className="fixed inset-0 -z-10 bg-brawl-pattern opacity-10 pointer-events-none"></div>
      <div className="container mx-auto px-4 py-8">
        <Header />
        <div className="mt-16 flex justify-center">
          <SignUpForm />
        </div>
      </div>
    </main>
  )
}
