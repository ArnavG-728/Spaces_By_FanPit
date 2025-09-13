"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, MapPin, Search } from "lucide-react"
import { format } from "date-fns"

export function HeroSection() {
  const [date, setDate] = useState<Date>()
  const [spaceType, setSpaceType] = useState(() => {
    if (typeof window === 'undefined') return ""
    try {
      return localStorage.getItem('hero.spaceType') || ""
    } catch {
      return ""
    }
  })
  const [location, setLocation] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('hero.spaceType', spaceType)
    } catch {
      // ignore storage errors
    }
  }, [spaceType])

  useEffect(() => {
    // Avoid SSR/client hydration mismatches for the Select
    setMounted(true)
  }, [])

  return (
    <section className="relative h-[400px] flex items-center justify-center px-4">
      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center text-black">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Find Your Perfect Space</h1>
          <p className="text-xl md:text-2xl mb-8 text-pretty">
            Discover and book amazing event spaces, co-working areas, and hangout spots
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-lg border shadow-md p-5 md:p-6 w-full mx-auto">
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-12 items-end">
            <div className="space-y-2 md:col-span-3">
              <label className="text-sm font-medium text-foreground leading-none h-5">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter city or area"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-3">
              <label className="text-sm font-medium text-foreground leading-none h-5">Space Type</label>
              {mounted ? (
                <Select value={spaceType} onValueChange={setSpaceType}>
                  <SelectTrigger className="w-full h-11 justify-start text-left font-normal bg-transparent">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="event">Event Space</SelectItem>
                    <SelectItem value="coworking">Co-working</SelectItem>
                    <SelectItem value="hangout">Hangout Spot</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="w-full h-11 rounded-md border bg-transparent" />
              )}
            </div>

            <div className="space-y-2 md:col-span-3">
              <label className="text-sm font-medium text-foreground leading-none h-5">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-11 justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2 md:col-span-3">
              <div className="h-5" aria-hidden />
              <Button className="w-full h-11">
                <Search className="mr-2 h-4 w-4" />
                Search Spaces
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
