"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type Currency = "BDT" | "USD"

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatAmount: (amount: number) => string
  convertAmount: (amount: number) => number
  getCurrencySymbol: () => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

// Exchange rate: 1 USD = 110 BDT (approximate)
const EXCHANGE_RATE = 110

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("BDT")

  // Load currency preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("currency")
    if (saved === "BDT" || saved === "USD") {
      setCurrencyState(saved)
    }
  }, [])

  // Save to localStorage when currency changes
  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem("currency", newCurrency)
  }

  // Convert BDT amount to selected currency
  const convertAmount = (bdtAmount: number): number => {
    if (currency === "USD") {
      return bdtAmount / EXCHANGE_RATE
    }
    return bdtAmount
  }

  // Format amount with currency symbol
  const formatAmount = (bdtAmount: number): string => {
    const converted = convertAmount(bdtAmount)
    const formatted = converted.toLocaleString(undefined, {
      minimumFractionDigits: currency === "USD" ? 2 : 0,
      maximumFractionDigits: currency === "USD" ? 2 : 0,
    })
    
    if (currency === "USD") {
      return `$${formatted}`
    }
    return `৳${formatted}`
  }

  // Get currency symbol only
  const getCurrencySymbol = (): string => {
    return currency === "USD" ? "$" : "৳"
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount, convertAmount, getCurrencySymbol }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
