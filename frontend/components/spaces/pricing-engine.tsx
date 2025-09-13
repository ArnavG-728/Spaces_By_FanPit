"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Tag, X } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

type PricingModel = 'free' | 'hourly' | 'daily' | 'monthly' | 'peak_off_peak'

export interface TimeBlock {
  id: string
  name: string
  startTime: string
  endTime: string
  price: number
}

export interface PeakHours {
  start: string
  end: string
  multiplier: number
}

export interface PromoCode {
  code: string
  discountType: 'percentage' | 'fixed'
  value: number
  validUntil: string
  maxUses?: number
  currentUses: number
}

export interface PricingData {
  model: PricingModel
  basePrice: number
  dailyRate: number
  monthlyRate: number
  isPeakPricingEnabled: boolean
  peakHours: PeakHours[]
  timeBlocks: TimeBlock[]
  promoCodes: PromoCode[]
  isPromoCodesEnabled: boolean
}

interface PricingEngineProps {
  pricing: PricingData
  onChange: (pricing: PricingData) => void
}

export function PricingEngine({ pricing, onChange }: PricingEngineProps) {
  // Keep a stable ref to the latest onChange to avoid effect dependency loops
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])
  const [pricingModel, setPricingModel] = useState<PricingModel>(pricing.model)
  const [basePrice, setBasePrice] = useState<number>(pricing.basePrice)
  const [dailyRate, setDailyRate] = useState<number>(pricing.dailyRate)
  const [monthlyRate, setMonthlyRate] = useState<number>(pricing.monthlyRate)
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(pricing.timeBlocks)
  const [peakHours, setPeakHours] = useState<PeakHours[]>(pricing.peakHours)
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(pricing.promoCodes)
  // Use local state for UI toggles to prevent unnecessary re-renders
  const [localPeakPricing, setLocalPeakPricing] = useState(pricing.isPeakPricingEnabled)
  const [localPromoCodes, setLocalPromoCodes] = useState(pricing.isPromoCodesEnabled)

  // Update parent when local state changes (avoid depending on onChange)
  useEffect(() => {
    onChangeRef.current({
      model: pricingModel,
      basePrice,
      dailyRate,
      monthlyRate,
      isPeakPricingEnabled: localPeakPricing,
      peakHours,
      timeBlocks,
      promoCodes,
      isPromoCodesEnabled: localPromoCodes
    })
  }, [
    pricingModel,
    basePrice,
    dailyRate,
    monthlyRate,
    localPeakPricing,
    peakHours,
    timeBlocks,
    promoCodes,
    localPromoCodes
  ])

  // Update local state when parent pricing changes
  useEffect(() => {
    // Only update if the values have actually changed
    if (pricing.model !== pricingModel) setPricingModel(pricing.model)
    if (pricing.basePrice !== basePrice) setBasePrice(pricing.basePrice)
    if (pricing.dailyRate !== dailyRate) setDailyRate(pricing.dailyRate)
    if (pricing.monthlyRate !== monthlyRate) setMonthlyRate(pricing.monthlyRate)
    if (JSON.stringify(pricing.timeBlocks) !== JSON.stringify(timeBlocks)) {
      setTimeBlocks(pricing.timeBlocks)
    }
    if (JSON.stringify(pricing.peakHours) !== JSON.stringify(peakHours)) {
      setPeakHours(pricing.peakHours)
    }
    if (JSON.stringify(pricing.promoCodes) !== JSON.stringify(promoCodes)) {
      setPromoCodes(pricing.promoCodes)
    }
    if (pricing.isPeakPricingEnabled !== localPeakPricing) {
      setLocalPeakPricing(pricing.isPeakPricingEnabled)
    }
    if (pricing.isPromoCodesEnabled !== localPromoCodes) {
      setLocalPromoCodes(pricing.isPromoCodesEnabled)
    }
  }, [pricing])

  const addTimeBlock = () => {
    const newBlock = {
      id: Date.now().toString(),
      name: `Block ${timeBlocks.length + 1}`,
      startTime: '09:00',
      endTime: '17:00',
      price: 0
    }
    setTimeBlocks([...timeBlocks, newBlock])
  }

  const removeTimeBlock = (id: string) => {
    setTimeBlocks(timeBlocks.filter(block => block.id !== id))
  }

  const updateTimeBlock = (id: string, field: keyof TimeBlock, value: string | number) => {
    const updatedBlocks = timeBlocks.map(block => 
      block.id === id ? { ...block, [field]: value } : block
    )
    setTimeBlocks(updatedBlocks)
  }

  const addPeakHours = () => {
    const newPeakHours = [...peakHours, {
      start: '09:00',
      end: '17:00',
      multiplier: 1.5
    }]
    setPeakHours(newPeakHours)
  }

  const removePeakHours = (index: number) => {
    const updatedPeakHours = peakHours.filter((_, i) => i !== index)
    setPeakHours(updatedPeakHours)
  }

  const handlePeakHoursChange = (index: number, field: keyof PeakHours, value: string | number) => {
    const updatedPeakHours = [...peakHours]
    updatedPeakHours[index] = {
      ...updatedPeakHours[index],
      [field]: field === 'multiplier' ? Number(value) : value
    }
    setPeakHours(updatedPeakHours)
  }

  const addPromoCode = () => {
    const newPromoCode: PromoCode = {
      code: `PROMO${promoCodes.length + 1}`,
      discountType: 'percentage',
      value: 10,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      currentUses: 0
    }
    setPromoCodes([...promoCodes, newPromoCode])
  }

  const removePromoCode = (code: string) => {
    const updatedPromoCodes = promoCodes.filter(promo => promo.code !== code)
    setPromoCodes(updatedPromoCodes)
  }

  const handlePromoCodeChange = (code: string, field: keyof PromoCode, value: any) => {
    const updatedPromoCodes = promoCodes.map(promo => 
      promo.code === code ? { ...promo, [field]: value } : promo
    )
    setPromoCodes(updatedPromoCodes)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pricing Engine</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs 
          value={pricingModel} 
          onValueChange={(value) => setPricingModel(value as PricingModel)}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="free">Free</TabsTrigger>
            <TabsTrigger value="hourly">Hourly</TabsTrigger>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="peak_off_peak">Peak/Off-Peak</TabsTrigger>
          </TabsList>

          <TabsContent value="free" className="space-y-4">
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-green-500" />
                <span>This space is free to book</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hourly" className="space-y-4">
            <div className="space-y-2">
              <Label>Base Hourly Rate</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">$</span>
                <Input 
                  type="number" 
                  value={basePrice} 
                  onChange={(e) => setBasePrice(Number(e.target.value))} 
                  className="pl-8"
                  min={0}
                  step={0.01}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="daily" className="space-y-4">
            <div className="space-y-2">
              <Label>Daily Rate</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">$</span>
                <Input 
                  type="number" 
                  value={dailyRate} 
                  onChange={(e) => setDailyRate(Number(e.target.value))} 
                  className="pl-8"
                  min={0}
                  step={0.01}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            <div className="space-y-2">
              <Label>Monthly Rate</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">$</span>
                <Input 
                  type="number" 
                  value={monthlyRate} 
                  onChange={(e) => setMonthlyRate(Number(e.target.value))} 
                  className="pl-8"
                  min={0}
                  step={0.01}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="peak_off_peak" className="space-y-4">
            <div className="space-y-2">
              <Label>Base Price</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">$</span>
                <Input 
                  type="number" 
                  value={basePrice} 
                  onChange={(e) => setBasePrice(Number(e.target.value))} 
                  className="pl-8"
                  min={0}
                  step={0.01}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <h4 className="font-medium">Peak Hours Pricing</h4>
                <p className="text-sm text-muted-foreground">Set higher prices during peak times</p>
              </div>
              <Switch 
                checked={localPeakPricing}
                onCheckedChange={(checked) => {
                  setLocalPeakPricing(checked)
                  onChange({
                    ...pricing,
                    isPeakPricingEnabled: checked
                  })
                }}
              />
            </div>

            {localPeakPricing && (
              <div className="space-y-4">
                {peakHours.map((peak, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-3">
                      <Label>Start Time</Label>
                      <Input 
                        type="time" 
                        value={peak.start}
                        onChange={(e) => {
                          const newPeakHours = [...peakHours]
                          newPeakHours[index].start = e.target.value
                          setPeakHours(newPeakHours)
                        }}
                      />
                    </div>
                    <div className="col-span-3">
                      <Label>End Time</Label>
                      <Input 
                        type="time" 
                        value={peak.end}
                        onChange={(e) => {
                          const newPeakHours = [...peakHours]
                          newPeakHours[index].end = e.target.value
                          setPeakHours(newPeakHours)
                        }}
                      />
                    </div>
                    <div className="col-span-4">
                      <Label>Multiplier</Label>
                      <div className="relative">
                        <Input 
                          type="number" 
                          value={peak.multiplier}
                          onChange={(e) => {
                            const newPeakHours = [...peakHours]
                            newPeakHours[index].multiplier = Number(e.target.value)
                            setPeakHours(newPeakHours)
                          }}
                          min={1}
                          step={0.1}
                        />
                        <span className="absolute right-3 top-2.5 text-muted-foreground">x</span>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-end h-8">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive"
                        onClick={() => removePeakHours(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addPeakHours}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Peak Hours
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Time Blocks</h4>
              <p className="text-sm text-muted-foreground">Set different prices for specific time blocks</p>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addTimeBlock}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Time Block
            </Button>
          </div>

          {timeBlocks.length > 0 && (
            <div className="space-y-4">
              {timeBlocks.map((block) => (
                <div key={block.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{block.name}</h4>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 -mt-2 -mr-2 text-destructive"
                      onClick={() => removeTimeBlock(block.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Start Time</Label>
                      <Input 
                        type="time" 
                        value={block.startTime}
                        onChange={(e) => updateTimeBlock(block.id, 'startTime', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>End Time</Label>
                      <Input 
                        type="time" 
                        value={block.endTime}
                        onChange={(e) => updateTimeBlock(block.id, 'endTime', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Price</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">$</span>
                        <Input 
                          type="number" 
                          value={block.price}
                          onChange={(e) => updateTimeBlock(block.id, 'price', Number(e.target.value))}
                          className="pl-8"
                          min={0}
                          step={0.01}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Promo Codes</h4>
              <p className="text-sm text-muted-foreground">Create discount codes for your space</p>
            </div>
            <div className="flex items-center space-x-4">
              <Switch 
                checked={localPromoCodes}
                onCheckedChange={(checked) => {
                  setLocalPromoCodes(checked)
                  onChange({
                    ...pricing,
                    isPromoCodesEnabled: checked
                  })
                }}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addPromoCode}
                disabled={!localPromoCodes}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Promo Code
              </Button>
            </div>
          </div>

          {localPromoCodes && promoCodes.length > 0 && (
            <div className="space-y-4">
              {promoCodes.map((promo) => (
                <div key={promo.code} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="secondary" className="text-sm font-mono">{promo.code}</Badge>
                      <div className="text-sm text-muted-foreground mt-1">
                        Valid until {new Date(promo.validUntil).toLocaleDateString()}
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 -mt-2 -mr-2"
                      onClick={() => removePromoCode(promo.code)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Discount Type</Label>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={promo.discountType}
                        onChange={(e) => {
                          setPromoCodes(promoCodes.map(p => 
                            p.code === promo.code 
                              ? { ...p, discountType: e.target.value as 'percentage' | 'fixed' }
                              : p
                          ))
                        }}
                      >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </div>
                    <div>
                      <Label>Value</Label>
                      <div className="relative">
                        {promo.discountType === 'percentage' && (
                          <span className="absolute right-3 top-2.5 text-muted-foreground">%</span>
                        )}
                        {promo.discountType === 'fixed' && (
                          <span className="absolute left-3 top-2.5">$</span>
                        )}
                        <Input 
                          type="number" 
                          value={promo.value}
                          onChange={(e) => {
                            setPromoCodes(promoCodes.map(p => 
                              p.code === promo.code 
                                ? { ...p, value: Number(e.target.value) }
                                : p
                            ))
                          }}
                          className={promo.discountType === 'fixed' ? 'pl-8' : 'pr-8'}
                          min={0}
                          step={0.01}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Valid Until</Label>
                      <Input 
                        type="date" 
                        value={promo.validUntil}
                        onChange={(e) => {
                          setPromoCodes(promoCodes.map(p => 
                            p.code === promo.code 
                              ? { ...p, validUntil: e.target.value }
                              : p
                          ))
                        }}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label>Max Uses (optional)</Label>
                      <Input 
                        type="number" 
                        value={promo.maxUses || ''}
                        onChange={(e) => {
                          const value = e.target.value ? parseInt(e.target.value, 10) : undefined
                          setPromoCodes(promoCodes.map(p => 
                            p.code === promo.code 
                              ? { ...p, maxUses: value }
                              : p
                          ))
                        }}
                        min={1}
                        placeholder="Unlimited"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
