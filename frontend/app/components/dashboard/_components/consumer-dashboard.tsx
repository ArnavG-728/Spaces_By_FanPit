"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Clock, CreditCard, Star, Search } from "lucide-react"
import { format } from "date-fns"
import { reservationsAPI } from "@/lib/api"

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "completed":
      return "bg-blue-100 text-blue-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function ConsumerDashboard() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const allBookings = await reservationsAPI.getAll()
        setBookings(allBookings)
      } catch (error) {
        console.error("Failed to fetch bookings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const upcomingBookings = bookings.filter(
    (booking) => booking.status === "confirmed" || booking.status === "pending"
  )
  const pastBookings = bookings.filter((booking) => booking.status === "completed")
  const totalSpent = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => router.push('/roles/consumer/dashboard/spaces')}
          >
            <Search className="h-4 w-4" />
            View All Spaces
          </Button>
        </div>
        <p className="text-muted-foreground">Manage your bookings and discover new spaces</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingBookings.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent}</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Spaces</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Saved for later</p>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
          <TabsTrigger value="past">Past Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {loading ? <p>Loading...</p> : upcomingBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No upcoming bookings</h3>
                <p className="text-muted-foreground text-center mb-4">Ready to book your next amazing space?</p>
                <Button>Browse Spaces</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking._id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <img
                        src={booking.space.images?.[0] || "/placeholder.svg"}
                        alt={booking.space.name}
                        className="w-full md:w-48 h-32 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-2">{booking.space.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {booking.space.address}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(booking.startTime), "MMM dd, yyyy")}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Booking Code</p>
                            <p className="font-mono text-sm">{booking._id}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total Amount</p>
                            <p className="text-lg font-semibold">${booking.totalPrice}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {booking.status === "confirmed" && (
                            <Button variant="outline" size="sm">
                              Cancel Booking
                            </Button>
                          )}
                          {booking.status === "pending" && <Button size="sm">Complete Payment</Button>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          {loading ? <p>Loading...</p> : pastBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No past bookings</h3>
                <p className="text-muted-foreground text-center">Your booking history will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pastBookings.map((booking) => (
                <Card key={booking._id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <img
                        src={booking.space.images?.[0] || "/placeholder.svg"}
                        alt={booking.space.name}
                        className="w-full md:w-48 h-32 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-2">{booking.space.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {booking.space.address}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(booking.startTime), "MMM dd, yyyy")}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Booking Code</p>
                            <p className="font-mono text-sm">{booking._id}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total Amount</p>
                            <p className="text-lg font-semibold">${booking.totalPrice}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            Leave Review
                          </Button>
                          <Button variant="outline" size="sm">
                            Book Again
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
