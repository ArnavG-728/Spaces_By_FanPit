"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Star, Search, Filter } from "lucide-react"
import Link from "next/link"
import { spacesAPI, Space } from "@/lib/api"

export function AllSpaces() {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [filteredSpaces, setFilteredSpaces] = useState<Space[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const data = await spacesAPI.getAllSpaces();
        setSpaces(data);
        setFilteredSpaces(data);
      } catch (error) {
        console.error("Error fetching spaces:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpaces()
  }, [])

  useEffect(() => {
    let result = [...spaces]
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(space => 
        space.name.toLowerCase().includes(term) || 
        space.description.toLowerCase().includes(term)
      )
    }
    
    if (locationFilter !== "all") {
      result = result.filter(space => space.address === locationFilter)
    }
    
    setFilteredSpaces(result)
  }, [searchTerm, locationFilter, spaces])

  const locations = [...new Set(spaces.map(space => space.address))]

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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search spaces..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
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
        
        <div className="text-sm text-muted-foreground mb-6">
          Showing {filteredSpaces.length} {filteredSpaces.length === 1 ? 'space' : 'spaces'}
        </div>
        
        {filteredSpaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpaces.map((space) => (
              <Card key={space._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="aspect-video bg-muted rounded-md mb-4 flex items-center justify-center">
                    <span className="text-muted-foreground">Space Image</span>
                  </div>
                  <CardTitle className="text-xl">{space.name}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {space.address}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{space.description}</p>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-4">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm">Up to {space.capacity} people</span>
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
                    <span className="text-2xl font-bold">${space.pricing.hourlyRate || 0}</span>
                    <span className="text-sm text-muted-foreground">/hour</span>
                  </div>
                  <Button asChild>
                    <Link href={`/spaces/${space._id}`}>View Details</Link>
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
