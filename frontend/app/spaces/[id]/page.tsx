'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users } from "lucide-react";
import { spacesAPI, reservationsAPI, Space } from "@/lib/api";
import { useAuth } from '@/contexts/auth-context';
import { processPayment } from "@/lib/razorpay";

export default function SpaceDetailPage() {
    const params = useParams();
  const { user } = useAuth();
  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const spaceData = await spacesAPI.getById(params.id as string);
        setSpace(spaceData);
      } catch (error) {
        console.error('Failed to fetch space:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchSpace();
    }
  }, [params.id]);

    const handleBooking = async () => {
    if (!user) {
      alert('Please log in to book a space.');
      return;
    }
    if (!space) return;

    setBooking(true);
    try {
      // 1. Create a reservation on the backend
      // This will return a pending reservation with a Razorpay order ID
      const startTime = new Date();
      const endTime = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now

      const reservationData = {
        spaceId: space._id,
                userId: user._id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      };

      const pendingReservation = await reservationsAPI.create(reservationData);

      // 2. Use the order ID from the backend to process payment
      const { orderId } = pendingReservation.paymentDetails;
      const { totalPrice } = pendingReservation;

      await processPayment(
        orderId,
        totalPrice,
                { name: user.name, email: user.email },
        (paymentResponse) => {
          console.log('Payment successful!', paymentResponse);
          alert('Booking and Payment successful! Your reservation is confirmed.');
          // Here you might want to redirect to a confirmation page or update the UI
        },
        (error) => {
          console.error('Payment failed:', error);
          alert(`Payment failed: ${error.description || 'Please try again.'}`);
        }
      );

    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading space details...</div>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Space not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <img src={space.images[0] || "/placeholder.svg"} alt={space.name} className="w-full h-96 object-cover rounded-lg" />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-4">{space.name}</h1>
          
          <div className="flex items-center gap-4 text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {space.address}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Up to {space.capacity} people
            </div>
          </div>

          <p className="text-lg mb-6">{space.description}</p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {space.amenities?.map((amenity: string) => (
                <Badge key={amenity} variant="outline">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-xl font-semibold">Pricing</h3>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ₹{space.pricing?.hourlyRate || 500}
                <span className="text-lg font-normal text-muted-foreground">/hour</span>
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={handleBooking} 
                        disabled={booking || !user}
            className="w-full"
            size="lg"
          >
            {booking ? 'Processing...' : user ? 'Book Now' : 'Login to Book'}
          </Button>
        </div>
      </div>
    </div>
  );
}
