"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type Currency = "BDT" | "USD"
type FormatType = "full" | "abbreviated"

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatAmount: (amount: number, formatType?: FormatType) => string
  convertAmount: (amount: number) => number
  getCurrencySymbol: () => string
  formatAbbreviated: (amount: number) => string
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

  // Format amount with abbreviated notation (K, Lakh, M)
  const formatAbbreviated = (bdtAmount: number): string => {
    const converted = convertAmount(bdtAmount)
    const symbol = getCurrencySymbol()

    if (currency === "BDT") {
      // BDT: K (1000), Lakh (100,000), Crore (10,000,000)
      if (converted >= 10000000) {
        return `${symbol}${(converted / 10000000).toFixed(2)}Cr`
      }
      if (converted >= 100000) {
        return `${symbol}${(converted / 100000).toFixed(2)}L`
      }
      if (converted >= 1000) {
        return `${symbol}${(converted / 1000).toFixed(1)}K`
      }
      return `${symbol}${converted.toLocaleString()}`
    } else {
      // USD: K, M, B
      if (converted >= 1000000000) {
        return `${symbol}${(converted / 1000000000).toFixed(2)}B`
      }
      if (converted >= 1000000) {
        return `${symbol}${(converted / 1000000).toFixed(2)}M`
      }
      if (converted >= 1000) {
        return `${symbol}${(converted / 1000).toFixed(1)}K`
      }
      return `${symbol}${converted.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    }
  }

  // Format amount with currency symbol (full format)
  const formatAmount = (bdtAmount: number, formatType: FormatType = "full"): string => {
    if (formatType === "abbreviated") {
      return formatAbbreviated(bdtAmount)
    }

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
    <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount, convertAmount, getCurrencySymbol, formatAbbreviated }}>
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
