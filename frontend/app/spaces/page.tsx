'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SpacesPage() {
  const [spaces, setSpaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await spacesAPI.getAll();
        setSpaces(response.data);
      } catch (error) {
        console.error('Failed to fetch spaces:', error);
        setSpaces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, []);

  const filteredSpaces = spaces.filter(space =>
    space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    space.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    space.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">All Spaces</h1>
        <p className="text-xl text-muted-foreground">Find the perfect space for your needs</p>
      </div>

      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search spaces..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p>Loading spaces...</p>
        </div>
      ) : filteredSpaces.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm ? 'No spaces found matching your search.' : 'No spaces available. Please add some spaces first.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSpaces.map((space) => (
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
                  {space.amenities?.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{space.amenities.length - 3} more
                    </Badge>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between">
                <div className="text-lg font-semibold">
                  ${space.hourlyRate || 0}
                  <span className="text-sm font-normal text-muted-foreground">/hour</span>
                </div>
                <Link href={`/spaces/${space._id}`}>
                  <Button>Book Now</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
