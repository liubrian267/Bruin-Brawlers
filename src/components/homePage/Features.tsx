import { Trophy, BarChart2, Users } from "lucide-react"

const features = [
  {
    icon: Trophy,
    title: "Post your victories and events",
    description: "Post your latest victories, share your favorite moments, or organize a tournament for others to join.",
  },
  {
    icon: BarChart2,
    title: "View Brawl Stars Analytics",
    description: "Get detailed insights into your gameplay and track your progress with our advanced analytics.",
  },
  {
    icon: Users,
    title: "Meet Fellow Brawlers",
    description: "Connect with other UCLA students who share your passion for Brawl Stars.",
  },
]

export default function Features() {
  return (
    <section className="py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">Why Join Bruin Brawlers?</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-lg">
            <feature.icon className="w-12 h-12 text-ucla-blue mb-4" />
            <h3 className="text-xl font-bold text-ucla-blue mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

