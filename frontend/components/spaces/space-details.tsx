"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { MapPin, Users, Star, Wifi, Coffee, Car, Shield } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface SpaceDetailsProps {
  spaceId: string
}

export function SpaceDetails({ spaceId }: SpaceDetailsProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()

  // Mock data - replace with actual API call
  const space = {
    id: spaceId,
    name: "Modern Event Hall",
    type: "Event Space",
    location: "Downtown",
    capacity: 200,
    price: 150,
    rating: 4.8,
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    description:
      "Elegant event space perfect for corporate events and celebrations. This modern venue features state-of-the-art facilities and can accommodate up to 200 guests.",
    amenities: [
      { name: "WiFi", icon: Wifi },
      { name: "Catering", icon: Coffee },
      { name: "Parking", icon: Car },
      { name: "Security", icon: Shield },
    ],
    address: "123 Main Street, Downtown, City 12345",
    rules: [
      "No smoking inside the venue",
      "Music must end by 11 PM",
      "Catering must be arranged through approved vendors",
      "Security deposit required",
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <img
              src={space.images[0] || "/placeholder.svg"}
              alt={space.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>

          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-balance">{space.name}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <Badge variant="secondary">{space.type}</Badge>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {space.location}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Up to {space.capacity}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {space.rating}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">About This Space</h2>
            <p className="text-muted-foreground text-pretty">{space.description}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {space.amenities.map((amenity) => {
                const Icon = amenity.icon
                return (
                  <div key={amenity.name} className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <span>{amenity.name}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Location</h2>
            <p className="text-muted-foreground mb-4">{space.address}</p>
            <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
              <p className="text-muted-foreground">Map would be displayed here</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">House Rules</h2>
            <ul className="space-y-2">
              {space.rules.map((rule, index) => (
                <li key={index} className="text-muted-foreground">
                  • {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>${space.price}/hour</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{space.rating}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Date</label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>

              <Link href="/checkout">
                <Button className="w-full" size="lg">
                  Book Now
                </Button>
              </Link>

              <div className="text-center text-sm text-muted-foreground">You won't be charged yet</div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>${space.price} x 4 hours</span>
                  <span>${space.price * 4}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service fee</span>
                  <span>${Math.round(space.price * 4 * 0.1)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Total</span>
                  <span>${space.price * 4 + Math.round(space.price * 4 * 0.1)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
