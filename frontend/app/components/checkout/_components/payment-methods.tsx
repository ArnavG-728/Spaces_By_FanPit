"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Smartphone, Shield } from "lucide-react"

interface PaymentMethodsProps {
  selectedMethod: string
  onMethodChange: (method: string) => void
  onPaymentProcess: (paymentData: any) => void
  amount: number
  isProcessing: boolean
}

export function PaymentMethods({
  selectedMethod,
  onMethodChange,
  onPaymentProcess,
  amount,
  isProcessing,
}: PaymentMethodsProps) {
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })
  const [upiId, setUpiId] = useState("")

  const handleCardPayment = () => {
    if (!cardData.number || !cardData.expiry || !cardData.cvv || !cardData.name) {
      return
    }
    onPaymentProcess({
      method: "card",
      data: cardData,
    })
  }

  const handleUpiPayment = () => {
    if (!upiId) return
    onPaymentProcess({
      method: "upi",
      data: { upiId },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={selectedMethod} onValueChange={onMethodChange}>
          <div className="space-y-4">
            {/* Credit/Debit Card */}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                <CreditCard className="h-4 w-4" />
                Credit/Debit Card
              </Label>
            </div>

            {selectedMethod === "card" && (
              <div className="ml-6 space-y-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    value={cardData.name}
                    onChange={(e) => setCardData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    value={cardData.number}
                    onChange={(e) => setCardData((prev) => ({ ...prev, number: e.target.value }))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      value={cardData.expiry}
                      onChange={(e) => setCardData((prev) => ({ ...prev, expiry: e.target.value }))}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      value={cardData.cvv}
                      onChange={(e) => setCardData((prev) => ({ ...prev, cvv: e.target.value }))}
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>
                <Button onClick={handleCardPayment} disabled={isProcessing} className="w-full">
                  {isProcessing ? "Processing..." : `Pay $${amount}`}
                </Button>
              </div>
            )}

            {/* UPI */}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="upi" id="upi" />
              <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer">
                <Smartphone className="h-4 w-4" />
                UPI
              </Label>
            </div>

            {selectedMethod === "upi" && (
              <div className="ml-6 space-y-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@paytm"
                  />
                </div>
                <Button onClick={handleUpiPayment} disabled={isProcessing || !upiId} className="w-full">
                  {isProcessing ? "Processing..." : `Pay $${amount} via UPI`}
                </Button>
              </div>
            )}
          </div>
        </RadioGroup>

        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t">
          <Shield className="h-4 w-4" />
          Your payment information is secure and encrypted
        </div>
      </CardContent>
    </Card>
  )
}
