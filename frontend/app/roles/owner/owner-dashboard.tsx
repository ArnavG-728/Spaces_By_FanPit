"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Calendar, DollarSign, Plus, Eye, Edit, Trash2, TrendingUp, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { spacesAPI, reservationsAPI, Space } from "@/lib/api"

interface SpaceWithStats extends Space {
  status: 'active' | 'inactive';
  bookings: number;
  revenue: number;
}


const getStatusColor = (status: 'active' | 'inactive' | 'confirmed' | 'pending' | 'completed' | 'cancelled') => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800"
    case "inactive":
      return "bg-gray-100 text-gray-800"
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

export function OwnerDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [spaces, setSpaces] = useState<SpaceWithStats[]>([])
  const [reservations, setReservations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

    useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [spacesData, reservationsData] = await Promise.all([
          spacesAPI.getAllSpaces(),
          reservationsAPI.getAll(),
        ])

        setReservations(reservationsData)

        const spacesWithStats: SpaceWithStats[] = spacesData.map(space => {
          const spaceReservations = reservationsData.filter(r => r.space._id === space._id)
          const spaceRevenue = spaceReservations.reduce((sum, r) => sum + r.totalPrice, 0)
          return {
            ...space,
            status: 'active' as const, // Default to active, update based on your business logic
            bookings: spaceReservations.length,
            revenue: spaceRevenue,
          }
        })

        setSpaces(spacesWithStats)
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setError('Failed to load dashboard data. Please try again.')
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const totalRevenue = spaces.reduce((sum, space) => sum + space.revenue, 0)
  const totalBookings = spaces.reduce((sum, space) => sum + space.bookings, 0)
  const activeSpaces = spaces.filter((space) => space.status === "active").length
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading spaces...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">Manage your spaces and track your business performance</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="spaces">My Spaces</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBookings}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Spaces</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeSpaces}</div>
                <p className="text-xs text-muted-foreground">Out of {spaces.length} total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spaces</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{spaces.length}</div>
                <p className="text-xs text-muted-foreground">Active on the platform</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {spaces.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">No spaces found. Add your first space to get started.</p>
                ) : spaces.slice(0, 3).map((space) => (
                  <div key={space._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{space.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Up to {space.capacity} guests • ${space.pricing.hourlyRate}/hour
                      </p>
                      <p className="text-sm text-muted-foreground">{space.bookings} total bookings</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${space.revenue} total</p>
                      <Badge className={getStatusColor(space.status)}>
                        {space.status.charAt(0).toUpperCase() + space.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spaces" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Spaces</h2>
            <Link href="/roles/owner/spaces/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Space
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space) => (
              <Card key={space._id}>
                <div className="relative">
                  <img src={"/placeholder.svg"} alt={space.name} className="w-full h-48 object-cover" />
                  <Badge className={`absolute top-3 left-3 ${getStatusColor(space.status)}`}>
                    {space.status.charAt(0).toUpperCase() + space.status.slice(1)}
                  </Badge>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-balance">{space.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {space.amenities[0] || 'Space'} • {space.amenities[1] || 'Flexible'}
                      </p>
                      <p className="text-sm text-muted-foreground">Up to {space.capacity} guests</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div>
                      <p className="text-lg font-semibold">{space.bookings}</p>
                      <p className="text-xs text-muted-foreground">Bookings</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">${space.pricing.hourlyRate}<span className="text-sm font-normal text-muted-foreground">/hour</span></p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                    <div>
                                          </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/spaces/${space._id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/owner/spaces/${space._id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive bg-transparent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">All Bookings</h2>
            <div className="flex gap-2">
              <Button variant="outline">Filter</Button>
              <Button variant="outline">Export</Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4">Space</th>
                      <th className="text-left p-4">Customer</th>
                      <th className="text-left p-4">Date & Time</th>
                      <th className="text-left p-4">Guests</th>
                      <th className="text-left p-4">Amount</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spaces.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-muted-foreground">
                          No bookings found. Bookings will appear here when available.
                        </td>
                      </tr>
                    ) : reservations.slice(0, 5).map((reservation) => (
                      <tr key={reservation._id} className="border-b">
                        <td className="p-4 font-medium">{reservation.space.name}</td>
                        <td className="p-4">{reservation.user.name}</td>
                        <td className="p-4">
                          <div>
                            <p>{new Date(reservation.startTime).toLocaleDateString()}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(reservation.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(reservation.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">{reservation.space.capacity}</td>
                        <td className="p-4 font-semibold">${reservation.totalPrice}</td>
                        <td className="p-4">
                          <Badge className={getStatusColor(reservation.status)}>
                            {reservation.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                    }
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-bold">Analytics & Insights</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Revenue chart would be displayed here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Booking Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Booking chart would be displayed here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Space Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {spaces.map((space) => (
                    <div key={space._id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{space.name}</p>
                        <p className="text-sm text-muted-foreground">{space.bookings} bookings</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${space.revenue}</p>
                                              </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Repeat Customers</span>
                    <span className="font-semibold">35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Booking Value</span>
                    <span className="font-semibold">${totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer Satisfaction</span>
                    <span className="font-semibold">4.8/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cancellation Rate</span>
                    <span className="font-semibold">8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
