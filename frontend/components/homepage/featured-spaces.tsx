import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Star } from "lucide-react"
import Link from "next/link"

const mockSpaces = [
  {
    id: "1",
    name: "Modern Event Hall",
    type: "Event Space",
    location: "Downtown",
    capacity: 200,
    price: 150,
    rating: 4.8,
    // image: "/placeholder.svg?height=200&width=300",
    description: "Elegant event space perfect for corporate events and celebrations",
    amenities: ["WiFi", "Catering", "AV Equipment"],
  },
  {
    id: "2",
    name: "Creative Co-working Hub",
    type: "Co-working",
    location: "Tech District",
    capacity: 50,
    price: 25,
    rating: 4.9,
    // image: "/placeholder.svg?height=200&width=300",
    description: "Inspiring workspace for entrepreneurs and freelancers",
    amenities: ["WiFi", "Coffee", "Meeting Rooms"],
  },
  {
    id: "3",
    name: "Rooftop Lounge",
    type: "Hangout Spot",
    location: "City Center",
    capacity: 80,
    price: 75,
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=300",
    description: "Stunning rooftop space with panoramic city views",
    amenities: ["Bar", "Outdoor Seating", "City View"],
  },
  {
    id: "4",
    name: "Art Gallery Space",
    type: "Event Space",
    location: "Arts Quarter",
    capacity: 120,
    price: 100,
    rating: 4.6,
    image: "/placeholder.svg?height=200&width=300",
    description: "Unique gallery space for exhibitions and private events",
    amenities: ["Gallery Lighting", "Security", "Parking"],
  },
  {
    id: "5",
    name: "Garden Workspace",
    type: "Co-working",
    location: "Suburbs",
    capacity: 30,
    price: 20,
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=300",
    description: "Peaceful workspace surrounded by nature",
    amenities: ["Garden View", "WiFi", "Quiet Zones"],
  },
  {
    id: "6",
    name: "Sports Bar & Lounge",
    type: "Hangout Spot",
    location: "Entertainment District",
    capacity: 100,
    price: 60,
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=300",
    description: "Lively sports bar perfect for watching games with friends",
    amenities: ["Sports TVs", "Bar", "Game Area"],
  },
]

export function FeaturedSpaces() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-balance">Featured Spaces</h2>
          <p className="text-xl text-muted-foreground text-pretty">Discover amazing spaces for every occasion</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockSpaces.map((space) => (
            <Card key={space.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img src={space.image || "/placeholder.svg"} alt={space.name} className="w-full h-48 object-cover" />
                <Badge className="absolute top-3 left-3" variant="secondary">
                  {space.type}
                </Badge>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-balance">{space.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{space.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {space.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Up to {space.capacity}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground mb-3 text-pretty">{space.description}</p>
                <div className="flex flex-wrap gap-1">
                  {space.amenities.slice(0, 3).map((amenity) => (
                    <Badge key={amenity} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between">
                <div className="text-lg font-semibold">
                  ${space.price}
                  <span className="text-sm font-normal text-muted-foreground">/hour</span>
                </div>
                <Link href={`/spaces/${space.id}`}>
                  <Button>Book Now</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Spaces
          </Button>
        </div>
      </div>
    </section>
  )
}
