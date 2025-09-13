"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, MapPin, Search } from "lucide-react"
import { format } from "date-fns"

export function HeroSection() {
  const [date, setDate] = useState<Date>()
  const [spaceType, setSpaceType] = useState("")
  const [location, setLocation] = useState("")

  return (
    <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-primary/20 to-secondary/20">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Find Your Perfect Space</h1>
        <p className="text-xl md:text-2xl mb-8 text-pretty">
          Discover and book amazing event spaces, co-working areas, and hangout spots
        </p>

        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter city or area"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Space Type</label>
              <Select value={spaceType} onValueChange={setSpaceType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event">Event Space</SelectItem>
                  <SelectItem value="coworking">Co-working</SelectItem>
                  <SelectItem value="hangout">Hangout Spot</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <Button size="lg" className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Search Spaces
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
