'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users } from "lucide-react"
import Link from "next/link"
import { spacesAPI } from "@/lib/api"
import { useEffect, useState } from "react"

export function FeaturedSpaces() {
  const [spaces, setSpaces] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const spacesData = await spacesAPI.getAllSpaces()
        setSpaces(spacesData.slice(0, 6)) // Show only first 6 spaces
      } catch (error) {
        console.error('Failed to fetch spaces:', error)
        setSpaces([]) // Show empty state instead of mock data
      } finally {
        setLoading(false)
      }
    }

    fetchSpaces()
  }, [])

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-balance">Featured Spaces</h2>
          <p className="text-xl text-muted-foreground text-pretty">Discover amazing spaces for every occasion</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p>Loading spaces...</p>
          </div>
        ) : spaces.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No spaces available. Please add some spaces first.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {spaces.map((space) => (
                <Card key={space._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img src="/placeholder.svg" alt={space.name} className="w-full h-48 object-cover" />
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-semibold text-balance">{space.name}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {space.address}
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
                      {space.amenities?.slice(0, 3).map((amenity: string) => (
                        <Badge key={amenity} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between">
                    <div className="text-lg font-semibold">
                      ${ (space?.pricing?.hourlyRate ?? space?.hourlyRate ?? 0) }
                      <span className="text-sm font-normal text-muted-foreground">/hour</span>
                    </div>
                    <Link href={`/spaces/${space._id}`}>
                      <Button>Book Now</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/spaces">
                <Button variant="outline" size="lg">
                  View All Spaces
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
