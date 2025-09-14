"use client"

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, CheckCircle, Search, QrCode, UserCheck, UserX, Flag } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

// Define types for our data
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Space {
  _id: string;
  name: string;
  capacity: number;
}

interface Reservation {
  id: string;
  user: User;
  space: Space;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  notes?: string;
}

interface Checkin {
  _id: string;
  reservation: string;
  checkinTime: string;
}

// We will define a more complete Issue type later
interface Issue {
  id: string;
  bookingCode: string;
  spaceName: string;
  issue: string;
  priority: string;
  status: string;
  reportedAt: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "confirmed":
      return "bg-blue-100 text-blue-800"
    case "completed":
      return "bg-green-100 text-green-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800"
    case "medium":
      return "bg-yellow-100 text-yellow-800"
    case "low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function StaffDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("today")
  const [bookings, setBookings] = useState<Reservation[]>([])
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [searchCode, setSearchCode] = useState("")
  const [newIssue, setNewIssue] = useState({
    bookingCode: "",
    issue: "",
    priority: "medium",
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // In a real app, you'd fetch from your API endpoint
        // For now, we'll use an empty array as we've removed mock data
        const { data: reservations } = await api.get('/reservations');
        setBookings(reservations);
        setIssues([]); // Issues will be implemented later

      } catch (error) {
        toast({
          title: "Error fetching data",
          description: "Could not load dashboard data. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const todayStats = {
    totalBookings: bookings.length,
    checkedIn: bookings.filter((b) => b.status === "confirmed").length, // Assuming 'confirmed' means checked-in for now
    completed: bookings.filter((b) => b.status === "completed").length,
    noShows: bookings.filter((b) => b.status === "cancelled").length, // Assuming 'cancelled' can represent no-shows
  }

  const handleCheckIn = async (bookingId: string) => {
    if (!user) return;
    try {
            await api.post('/checkins', { reservation: bookingId, user: user.id });
      await api.patch(`/reservations/${bookingId}`, { status: 'confirmed' });

      toast({
        title: "Guest Checked In",
        description: "Guest has been successfully checked in.",
      });

      // Refresh data
      const res = await fetch('http://localhost:3000/reservations');
      const updatedBookings = await res.json();
      setBookings(updatedBookings);

    } catch (error) {
      toast({
        title: "Check-in Failed",
        description: (error as Error).message || "Could not check in the guest.",
        variant: "destructive",
      });
    }
  };


  const handleMarkNoShow = async (bookingId: string) => {
    try {
      await api.patch(`/reservations/${bookingId}`, { status: 'cancelled' });

      toast({
        title: "Marked as No-Show",
        description: "Booking has been marked as no-show.",
      });

      // Refresh data
      const res = await fetch('http://localhost:3000/reservations');
      const updatedBookings = await res.json();
      setBookings(updatedBookings);

    } catch (error) {
      toast({
        title: "Update Failed",
        description: (error as Error).message || "Could not update the booking status.",
        variant: "destructive",
      });
    }
  };

  const handleSearchBooking = async () => {
    if (!searchCode) {
      toast({
        title: "Enter Booking Code",
        description: "Please enter a booking code to search.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: booking } = await api.get(`/reservations/${searchCode}`);
      // For simplicity, we'll just toast. A real app might show the booking details.
      toast({
        title: "Booking Found",
        description: `Found booking for ${booking.user.firstName} at ${booking.space.name}`,
      });
    } catch (error) {
      toast({
        title: "Booking Not Found",
        description: "No booking found with that code.",
        variant: "destructive",
      });
    }
  };

  const handleReportIssue = () => {
    if (!newIssue.bookingCode || !newIssue.issue) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Issue Reported",
      description: "The issue has been reported and will be addressed.",
    })

    setNewIssue({ bookingCode: "", issue: "", priority: "medium" })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Staff Dashboard</h1>
        <p className="text-muted-foreground">Manage daily operations and guest check-ins</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="today">Today's Schedule</TabsTrigger>
          <TabsTrigger value="checkin">Quick Check-in</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          {/* Daily Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayStats.totalBookings}</div>
                <p className="text-xs text-muted-foreground">Today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Checked In</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayStats.checkedIn}</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayStats.completed}</div>
                <p className="text-xs text-muted-foreground">Finished today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">No-Shows</CardTitle>
                <UserX className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayStats.noShows}</div>
                <p className="text-xs text-muted-foreground">Didn't show up</p>
              </CardContent>
            </Card>
          </div>

          {/* Today's Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Bookings - {format(new Date(), "MMMM dd, yyyy")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{booking.space.name}</h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.replace("-", " ").toUpperCase()}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <p>
                              <strong>Customer:</strong> {`${booking.user.firstName} ${booking.user.lastName}`}
                            </p>
                            <p>
                              </p>
                            <p>
                              <strong>Booking Code:</strong> {booking.id}
                            </p>
                          </div>
                          <div>
                            <p>
                              <strong>Time:</strong> {format(new Date(booking.startTime), "HH:mm")} - {format(new Date(booking.endTime), "HH:mm")}
                            </p>
                            <p>
                              <strong>Capacity:</strong> {booking.space.capacity}
                            </p>
                          </div>
                        </div>

                        {booking.notes && (
                          <div className="mt-2 p-2 bg-muted rounded text-sm">
                            <strong>Notes:</strong> {booking.notes}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 min-w-[120px]">
                        {booking.status === "pending" && (
                          <>
                            <Button size="sm" onClick={() => handleCheckIn(booking.id)}>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Check In
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleMarkNoShow(booking.id)}>
                              <UserX className="mr-2 h-4 w-4" />
                              No Show
                            </Button>
                          </>
                        )}

                        {booking.status === "confirmed" && (
                          <Button variant="outline" size="sm" disabled>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Checked In
                          </Button>
                        )}

                        {(booking.status === "completed" || booking.status === "cancelled") && (
                          <Button variant="outline" size="sm" disabled>
                            {booking.status === "completed" ? "Completed" : "Cancelled"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checkin" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Search by Booking Code */}
            <Card>
              <CardHeader>
                <CardTitle>Search Booking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Booking Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="search"
                      value={searchCode}
                      onChange={(e) => setSearchCode(e.target.value)}
                      placeholder="Enter booking code (e.g., SB001234)"
                    />
                    <Button onClick={handleSearchBooking}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter the booking code to quickly find and manage a reservation.
                </p>
              </CardContent>
            </Card>

            {/* QR Code Scanner */}
            <Card>
              <CardHeader>
                <CardTitle>QR Code Scanner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <QrCode className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    QR code scanner would be integrated here for quick check-ins
                  </p>
                  <Button variant="outline" className="mt-4 bg-transparent">
                    Open Scanner
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="issues" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Report New Issue */}
            <Card>
              <CardHeader>
                <CardTitle>Report Issue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="issueBookingCode">Booking Code</Label>
                  <Input
                    id="issueBookingCode"
                    value={newIssue.bookingCode}
                    onChange={(e) => setNewIssue((prev) => ({ ...prev, bookingCode: e.target.value }))}
                    placeholder="e.g., SB001234"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newIssue.priority}
                    onValueChange={(value) => setNewIssue((prev) => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issueDescription">Issue Description</Label>
                  <Textarea
                    id="issueDescription"
                    value={newIssue.issue}
                    onChange={(e) => setNewIssue((prev) => ({ ...prev, issue: e.target.value }))}
                    placeholder="Describe the issue in detail..."
                    rows={4}
                  />
                </div>

                <Button onClick={handleReportIssue} className="w-full">
                  <Flag className="mr-2 h-4 w-4" />
                  Report Issue
                </Button>
              </CardContent>
            </Card>

            {/* Current Issues */}
            <Card>
              <CardHeader>
                <CardTitle>Current Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {issues.map((issue) => (
                    <div key={issue.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{issue.spaceName}</h4>
                          <p className="text-sm text-muted-foreground">Code: {issue.bookingCode}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(issue.priority)}>{issue.priority.toUpperCase()}</Badge>
                          <Badge variant={issue.status === "resolved" ? "default" : "secondary"}>
                            {issue.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm mb-2">{issue.issue}</p>
                      <p className="text-xs text-muted-foreground">
                        Reported: {format(new Date(issue.reportedAt), "MMM dd, yyyy HH:mm")}
                      </p>
                      {issue.status === "open" && (
                        <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                          Mark Resolved
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}