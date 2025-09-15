"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PaymentMethods } from "./payment-methods"
import { CalendarIcon, MapPin, Users, Clock, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { spacesAPI, reservationsAPI, Space } from "@/lib/api"


export function CheckoutFlow() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [space, setSpace] = useState<Space | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [guestCount, setGuestCount] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingDetails, setBookingDetails] = useState<any>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (id) {
      spacesAPI.getById(id).then(setSpace).catch(console.error)
    }
  }, [id])

  const calculateTotal = () => {
    if (!startTime || !endTime) return { hours: 0, subtotal: 0, serviceFee: 0, tax: 0, total: 0 }
    const start = Number.parseInt(startTime.split(":")[0])
    const end = Number.parseInt(endTime.split(":")[0])
    const hours = end - start
    const subtotal = hours * (space?.pricing.hourlyRate || 0)
    const serviceFee = Math.round(subtotal * 0.1)
    const tax = Math.round(subtotal * 0.08)
    return {
      hours,
      subtotal,
      serviceFee,
      tax,
      total: subtotal + serviceFee + tax,
    }
  }

  const pricing = calculateTotal()

  const handlePaymentProcess = async (paymentData: any) => {
    if (!selectedDate || !startTime || !endTime || !guestCount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

        try {
            const booking = await reservationsAPI.create({
        spaceId: space!._id,
        userId: user!._id,
        startTime: new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${startTime}`).toISOString(),
        endTime: new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${endTime}`).toISOString(),
      });

      setBookingDetails(booking);
      setBookingComplete(true);

      toast({
        title: "Payment Successful!",
        description: "Your booking has been confirmed. Check your email for details.",
      });
        } catch (error) {
      console.error("Payment failed:", error);
      toast({
        title: "Payment Failed",
        description: "Could not process your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }

  if (bookingComplete && bookingDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">Your space has been successfully booked</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Booking Code</p>
                  <p className="font-mono font-semibold">{bookingDetails.bookingCode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold text-green-600">Confirmed</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">{bookingDetails.space.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p>{format(bookingDetails.date, "MMMM dd, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Time</p>
                    <p>
                      {bookingDetails.startTime} - {bookingDetails.endTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Guests</p>
                    <p>{bookingDetails.guests}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Amount</p>
                    <p className="font-semibold">${bookingDetails.total}</p>
                  </div>
                </div>
              </div>

              {bookingDetails.specialRequests && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Special Requests</p>
                    <p className="text-sm">{bookingDetails.specialRequests}</p>
                  </div>
                </>
              )}

              <Separator />

              <div className="text-sm text-muted-foreground">
                <p>A confirmation email has been sent to your registered email address.</p>
                <p>Please save your booking code for future reference.</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 mt-8">
            <Button onClick={() => router.push("/dashboard")} className="flex-1">
              View My Bookings
            </Button>
            <Button variant="outline" onClick={() => router.push("/")} className="flex-1">
              Book Another Space
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
          <p className="text-muted-foreground">Review your details and confirm your reservation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Details Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Space Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Space Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <img
                    src={space?.images?.[0] || "/placeholder.svg"}
                    alt={space?.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{space?.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {space?.address}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Up to {space?.capacity}
                      </div>
                    </div>
                    <p className="text-lg font-semibold mt-2">${space?.pricing.hourlyRate}/hour</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date & Time Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Date & Time</CardTitle>
                <CardDescription>Select when you'd like to use the space</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Select value={startTime} onValueChange={setStartTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Start time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                            {`${i.toString().padStart(2, "0")}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Select value={endTime} onValueChange={setEndTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="End time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                            {`${i.toString().padStart(2, "0")}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {pricing.hours > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Duration: {pricing.hours} hours
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Guest Information */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>Tell us about your event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="guests">Number of Guests</Label>
                  <Input
                    id="guests"
                    type="number"
                    placeholder="Enter number of guests"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    max={space?.capacity}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requests">Special Requests (Optional)</Label>
                  <Textarea
                    id="requests"
                    placeholder="Any special requirements or requests..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <PaymentMethods
              selectedMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
              onPaymentProcess={handlePaymentProcess}
              amount={pricing.total}
              isProcessing={isProcessing}
            />
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedDate && (
                  <div className="flex justify-between text-sm">
                    <span>Date:</span>
                    <span>{format(selectedDate, "MMM dd, yyyy")}</span>
                  </div>
                )}

                {startTime && endTime && (
                  <div className="flex justify-between text-sm">
                    <span>Time:</span>
                    <span>
                      {startTime} - {endTime}
                    </span>
                  </div>
                )}

                {guestCount && (
                  <div className="flex justify-between text-sm">
                    <span>Guests:</span>
                    <span>{guestCount}</span>
                  </div>
                )}

                <Separator />

                {pricing.hours > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>
                        ${space?.pricing.hourlyRate || 0} x {pricing.hours} hours
                      </span>
                      <span>${pricing.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Service fee</span>
                      <span>${pricing.serviceFee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>${pricing.tax}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${pricing.total}</span>
                    </div>
                  </>
                )}

                <div className="text-center text-sm text-muted-foreground pt-4">
                  {!paymentMethod && "Select a payment method to continue"}
                  {paymentMethod && !isProcessing && "Ready to complete your booking"}
                  {isProcessing && "Processing your payment..."}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
