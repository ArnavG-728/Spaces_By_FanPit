"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Star, Search, Filter } from "lucide-react"
import Link from "next/link"

type Space = {
  id: string
  name: string
  type: string
  location: string
  capacity: number
  pricePerHour: number
  rating: number
  description: string
  amenities: string[]
}

export function AllSpaces() {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [filteredSpaces, setFilteredSpaces] = useState<Space[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  // Fetch spaces from API or use mock data
  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchSpaces = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data - replace with actual API call
        const mockSpaces: Space[] = [
          {
            id: "1",
            name: "Modern Event Hall",
            type: "Event Space",
            location: "Downtown",
            capacity: 200,
            pricePerHour: 150,
            rating: 4.8,
            description: "Elegant event space perfect for corporate events and celebrations",
            amenities: ["WiFi", "Catering", "AV Equipment"],
          },
          {
            id: "2",
            name: "Creative Co-working Hub",
            type: "Co-working",
            location: "Tech District",
            capacity: 50,
            pricePerHour: 25,
            rating: 4.9,
            description: "Inspiring workspace for entrepreneurs and freelancers",
            amenities: ["WiFi", "Coffee", "Meeting Rooms"],
          },
          {
            id: "3",
            name: "Rooftop Lounge",
            type: "Hangout Spot",
            location: "City Center",
            capacity: 80,
            pricePerHour: 75,
            rating: 4.7,
            description: "Stunning rooftop space with panoramic city views",
            amenities: ["Bar", "Outdoor Seating", "City View"],
          },
          {
            id: "4",
            name: "Art Gallery Space",
            type: "Event Space",
            location: "Arts Quarter",
            capacity: 120,
            pricePerHour: 100,
            rating: 4.6,
            description: "Chic gallery space for exhibitions and events",
            amenities: ["Gallery Lighting", "Security", "Coat Check"],
          },
        ]
        
        setSpaces(mockSpaces)
        setFilteredSpaces(mockSpaces)
      } catch (error) {
        console.error("Error fetching spaces:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSpaces()
  }, [])

  // Apply filters and search
  useEffect(() => {
    let result = [...spaces]
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(space => 
        space.name.toLowerCase().includes(term) || 
        space.description.toLowerCase().includes(term) ||
        space.type.toLowerCase().includes(term)
      )
    }
    
    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter(space => space.type === typeFilter)
    }
    
    // Apply location filter
    if (locationFilter !== "all") {
      result = result.filter(space => space.location === locationFilter)
    }
    
    setFilteredSpaces(result)
  }, [searchTerm, typeFilter, locationFilter, spaces])

  // Get unique types and locations for filters
  const spaceTypes = [...new Set(spaces.map(space => space.type))]
  const locations = [...new Set(spaces.map(space => space.location))]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">All Available Spaces</h1>
        
        {/* Search and Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search spaces..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select onValueChange={setTypeFilter} value={typeFilter}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {spaceTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select onValueChange={setLocationFilter} value={locationFilter}>
            <SelectTrigger>
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Results Count */}
        <div className="text-sm text-muted-foreground mb-6">
          Showing {filteredSpaces.length} {filteredSpaces.length === 1 ? 'space' : 'spaces'}
        </div>
        
        {/* Spaces Grid */}
        {filteredSpaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpaces.map((space) => (
              <Card key={space.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="aspect-video bg-muted rounded-md mb-4 flex items-center justify-center">
                    <span className="text-muted-foreground">Space Image</span>
                  </div>
                  <CardTitle className="text-xl">{space.name}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {space.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{space.description}</p>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-4">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm">Up to {space.capacity} people</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm">{space.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {space.amenities.slice(0, 3).map((amenity, index) => (
                      <Badge key={index} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                    {space.amenities.length > 3 && (
                      <Badge variant="outline">+{space.amenities.length - 3} more</Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold">${space.pricePerHour}</span>
                    <span className="text-sm text-muted-foreground">/hour</span>
                  </div>
                  <Button asChild>
                    <Link href={`/components/spaces/${space.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No spaces found</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
