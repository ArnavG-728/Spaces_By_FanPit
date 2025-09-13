import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Event Planner",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    content:
      "Spaces made finding the perfect venue for our corporate event so easy. The booking process was seamless and the space exceeded our expectations!",
  },
  {
    id: 2,
    name: "Mike Chen",
    role: "Freelance Designer",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    content:
      "As a freelancer, I love the variety of co-working spaces available. The platform is user-friendly and I've discovered some amazing workspaces.",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Startup Founder",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    content:
      "The quality of spaces on Spaces is outstanding. We've hosted multiple team events and each venue has been perfect for our needs.",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-balance">What Our Users Say</h2>
          <p className="text-xl text-muted-foreground text-pretty">
            Join thousands of satisfied customers who found their perfect space
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-background">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 text-pretty">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
