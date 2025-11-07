"use client"

import { useAppStore } from "@/store/app-store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CURRENCY_UNITS } from "@/lib/currency-formatter"
import { DollarSign } from "lucide-react"

interface CurrencySelectorProps {
  className?: string
  showLabel?: boolean
}

export function CurrencySelector({ className = "", showLabel = true }: CurrencySelectorProps) {
  const { currencyUnit, setCurrencyUnit } = useAppStore()

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground shrink-0">
          <DollarSign className="h-4 w-4" />
          <span>Display:</span>
        </div>
      )}
      <Select value={currencyUnit} onValueChange={setCurrencyUnit}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CURRENCY_UNITS.map((unit) => (
            <SelectItem key={unit.value} value={unit.value}>
              <div className="flex flex-col">
                <span>{unit.label}</span>
                <span className="text-xs text-muted-foreground">{unit.example}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
