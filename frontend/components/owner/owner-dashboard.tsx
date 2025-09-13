"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Calendar, DollarSign, Plus, Eye, Edit, Trash2, TrendingUp } from "lucide-react"
import Link from "next/link"

// Mock data - replace with actual API calls
const mockSpaces = [
  {
    id: "1",
    name: "Modern Event Hall",
    type: "Event Space",
    location: "Downtown",
    capacity: 200,
    price: 150,
    status: "active",
    image: "/placeholder.svg?height=100&width=150",
    bookings: 12,
    revenue: 1800,
    occupancy: 75,
  },
  {
    id: "2",
    name: "Creative Studio",
    type: "Co-working",
    location: "Arts District",
    capacity: 50,
    price: 25,
    status: "active",
    image: "/placeholder.svg?height=100&width=150",
    bookings: 28,
    revenue: 700,
    occupancy: 85,
  },
  {
    id: "3",
    name: "Rooftop Terrace",
    type: "Event Space",
    location: "City Center",
    capacity: 80,
    price: 100,
    status: "inactive",
    image: "/placeholder.svg?height=100&width=150",
    bookings: 0,
    revenue: 0,
    occupancy: 0,
  },
]

const mockBookings = [
  {
    id: "1",
    spaceName: "Modern Event Hall",
    customerName: "John Smith",
    date: "2024-12-20",
    time: "14:00 - 18:00",
    status: "confirmed",
    amount: 660,
    guests: 150,
  },
  {
    id: "2",
    spaceName: "Creative Studio",
    customerName: "Sarah Johnson",
    date: "2024-12-18",
    time: "09:00 - 17:00",
    status: "completed",
    amount: 220,
    guests: 25,
  },
  {
    id: "3",
    spaceName: "Modern Event Hall",
    customerName: "Mike Chen",
    date: "2024-12-25",
    time: "19:00 - 23:00",
    status: "pending",
    amount: 440,
    guests: 100,
  },
]

const getStatusColor = (status: string) => {
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
  const [activeTab, setActiveTab] = useState("overview")

  const totalRevenue = mockSpaces.reduce((sum, space) => sum + space.revenue, 0)
  const totalBookings = mockSpaces.reduce((sum, space) => sum + space.bookings, 0)
  const activeSpaces = mockSpaces.filter((space) => space.status === "active").length
  const avgOccupancy = Math.round(mockSpaces.reduce((sum, space) => sum + space.occupancy, 0) / mockSpaces.length)

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
                <p className="text-xs text-muted-foreground">Out of {mockSpaces.length} total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Occupancy</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgOccupancy}%</div>
                <p className="text-xs text-muted-foreground">This month</p>
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
                {mockBookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{booking.spaceName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {booking.customerName} • {booking.date} • {booking.time}
                      </p>
                      <p className="text-sm text-muted-foreground">{booking.guests} guests</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${booking.amount}</p>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
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
            <Link href="/owner/spaces/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Space
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSpaces.map((space) => (
              <Card key={space.id}>
                <div className="relative">
                  <img src={space.image || "/placeholder.svg"} alt={space.name} className="w-full h-48 object-cover" />
                  <Badge className={`absolute top-3 left-3 ${getStatusColor(space.status)}`}>{space.status}</Badge>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-balance">{space.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {space.type} • {space.location}
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
                      <p className="text-lg font-semibold">${space.revenue}</p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{space.occupancy}%</p>
                      <p className="text-xs text-muted-foreground">Occupancy</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/spaces/${space.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/owner/spaces/${space.id}/edit`} className="flex-1">
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
                    {mockBookings.map((booking) => (
                      <tr key={booking.id} className="border-b">
                        <td className="p-4 font-medium">{booking.spaceName}</td>
                        <td className="p-4">{booking.customerName}</td>
                        <td className="p-4">
                          <div>
                            <p>{booking.date}</p>
                            <p className="text-sm text-muted-foreground">{booking.time}</p>
                          </div>
                        </td>
                        <td className="p-4">{booking.guests}</td>
                        <td className="p-4 font-semibold">${booking.amount}</td>
                        <td className="p-4">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            {booking.status === "pending" && <Button size="sm">Confirm</Button>}
                          </div>
                        </td>
                      </tr>
                    ))}
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
                  {mockSpaces.map((space) => (
                    <div key={space.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{space.name}</p>
                        <p className="text-sm text-muted-foreground">{space.bookings} bookings</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${space.revenue}</p>
                        <p className="text-sm text-muted-foreground">{space.occupancy}% occupancy</p>
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
                    <span className="font-semibold">${Math.round(totalRevenue / totalBookings)}</span>
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
