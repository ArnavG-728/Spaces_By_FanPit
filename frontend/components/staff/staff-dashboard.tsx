"use client"

import { useState } from "react"
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

// Mock data - replace with actual API calls
const mockTodayBookings = [
  {
    id: "1",
    bookingCode: "SB001234",
    spaceName: "Modern Event Hall",
    customerName: "John Smith",
    customerPhone: "+1 (555) 123-4567",
    startTime: "14:00",
    endTime: "18:00",
    guests: 150,
    status: "pending",
    specialRequests: "Need extra chairs and microphone setup",
    checkInTime: null,
    checkOutTime: null,
  },
  {
    id: "2",
    bookingCode: "SB001235",
    spaceName: "Creative Studio",
    customerName: "Sarah Johnson",
    customerPhone: "+1 (555) 987-6543",
    startTime: "09:00",
    endTime: "17:00",
    guests: 25,
    status: "checked-in",
    specialRequests: "Vegetarian catering requested",
    checkInTime: "08:45",
    checkOutTime: null,
  },
  {
    id: "3",
    bookingCode: "SB001236",
    spaceName: "Rooftop Lounge",
    customerName: "Mike Chen",
    customerPhone: "+1 (555) 456-7890",
    startTime: "19:00",
    endTime: "23:00",
    guests: 80,
    status: "completed",
    specialRequests: null,
    checkInTime: "18:50",
    checkOutTime: "23:15",
  },
  {
    id: "4",
    bookingCode: "SB001237",
    spaceName: "Conference Room A",
    customerName: "Emily Davis",
    customerPhone: "+1 (555) 321-0987",
    startTime: "10:00",
    endTime: "12:00",
    guests: 15,
    status: "no-show",
    specialRequests: null,
    checkInTime: null,
    checkOutTime: null,
  },
]

const mockIssues = [
  {
    id: "1",
    bookingCode: "SB001234",
    spaceName: "Modern Event Hall",
    issue: "Air conditioning not working properly",
    priority: "high",
    status: "open",
    reportedAt: "2024-12-15T10:30:00Z",
  },
  {
    id: "2",
    bookingCode: "SB001235",
    spaceName: "Creative Studio",
    issue: "WiFi password not working",
    priority: "medium",
    status: "resolved",
    reportedAt: "2024-12-15T09:15:00Z",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "checked-in":
      return "bg-blue-100 text-blue-800"
    case "completed":
      return "bg-green-100 text-green-800"
    case "no-show":
      return "bg-red-100 text-red-800"
    case "cancelled":
      return "bg-gray-100 text-gray-800"
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
  const [searchCode, setSearchCode] = useState("")
  const [newIssue, setNewIssue] = useState({
    bookingCode: "",
    issue: "",
    priority: "medium",
  })
  const { toast } = useToast()

  const todayStats = {
    totalBookings: mockTodayBookings.length,
    checkedIn: mockTodayBookings.filter((b) => b.status === "checked-in").length,
    completed: mockTodayBookings.filter((b) => b.status === "completed").length,
    noShows: mockTodayBookings.filter((b) => b.status === "no-show").length,
  }

  const handleCheckIn = (bookingId: string) => {
    toast({
      title: "Guest Checked In",
      description: "Guest has been successfully checked in.",
    })
    // Update booking status in real app
  }

  const handleCheckOut = (bookingId: string) => {
    toast({
      title: "Guest Checked Out",
      description: "Guest has been successfully checked out.",
    })
    // Update booking status in real app
  }

  const handleMarkNoShow = (bookingId: string) => {
    toast({
      title: "Marked as No-Show",
      description: "Booking has been marked as no-show.",
    })
    // Update booking status in real app
  }

  const handleSearchBooking = () => {
    if (!searchCode) {
      toast({
        title: "Enter Booking Code",
        description: "Please enter a booking code to search.",
        variant: "destructive",
      })
      return
    }

    const booking = mockTodayBookings.find((b) => b.bookingCode.toLowerCase().includes(searchCode.toLowerCase()))
    if (booking) {
      toast({
        title: "Booking Found",
        description: `Found booking for ${booking.customerName} at ${booking.spaceName}`,
      })
    } else {
      toast({
        title: "Booking Not Found",
        description: "No booking found with that code.",
        variant: "destructive",
      })
    }
  }

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
                {mockTodayBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{booking.spaceName}</h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.replace("-", " ").toUpperCase()}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <p>
                              <strong>Customer:</strong> {booking.customerName}
                            </p>
                            <p>
                              <strong>Phone:</strong> {booking.customerPhone}
                            </p>
                            <p>
                              <strong>Booking Code:</strong> {booking.bookingCode}
                            </p>
                          </div>
                          <div>
                            <p>
                              <strong>Time:</strong> {booking.startTime} - {booking.endTime}
                            </p>
                            <p>
                              <strong>Guests:</strong> {booking.guests}
                            </p>
                            {booking.checkInTime && (
                              <p>
                                <strong>Checked In:</strong> {booking.checkInTime}
                              </p>
                            )}
                            {booking.checkOutTime && (
                              <p>
                                <strong>Checked Out:</strong> {booking.checkOutTime}
                              </p>
                            )}
                          </div>
                        </div>

                        {booking.specialRequests && (
                          <div className="mt-2 p-2 bg-muted rounded text-sm">
                            <strong>Special Requests:</strong> {booking.specialRequests}
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

                        {booking.status === "checked-in" && (
                          <Button size="sm" onClick={() => handleCheckOut(booking.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Check Out
                          </Button>
                        )}

                        {(booking.status === "completed" || booking.status === "no-show") && (
                          <Button variant="outline" size="sm" disabled>
                            {booking.status === "completed" ? "Completed" : "No Show"}
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
                  {mockIssues.map((issue) => (
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
