/**
 * Currency Formatter Utility
 * Supports multiple display formats: K (thousands), M (millions), Lakh, Crore
 */

export type CurrencyUnit = "default" | "K" | "M" | "lakh" | "crore"

interface CurrencyFormatOptions {
  unit?: CurrencyUnit
  decimals?: number
  currency?: string
  showUnit?: boolean
}

/**
 * Format amount with selected unit
 */
export function formatCurrency(amount: number, options: CurrencyFormatOptions = {}): string {
  const {
    unit = "default",
    decimals = 0,
    currency = "৳",
    showUnit = true
  } = options

  if (amount === 0) return `${currency}0`

  let value: number
  let suffix = ""

  switch (unit) {
    case "K":
      value = amount / 1000
      suffix = showUnit ? "K" : ""
      break
    
    case "M":
      value = amount / 1000000
      suffix = showUnit ? "M" : ""
      break
    
    case "lakh":
      value = amount / 100000
      suffix = showUnit ? "L" : "" // L for Lakh
      break
    
    case "crore":
      value = amount / 10000000
      suffix = showUnit ? "Cr" : "" // Cr for Crore
      break
    
    case "default":
    default:
      value = amount
      suffix = ""
      break
  }

  // Format with commas for default, otherwise use fixed decimals
  let formattedValue: string
  if (unit === "default") {
    formattedValue = value.toLocaleString("en-IN", {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    })
  } else {
    formattedValue = value.toFixed(decimals)
  }

  return `${currency}${formattedValue}${suffix}`
}

/**
 * Auto-select best unit based on amount
 */
export function formatCurrencyAuto(amount: number, options: Omit<CurrencyFormatOptions, "unit"> = {}): string {
  const { decimals = 1, currency = "৳" } = options

  if (amount >= 10000000) {
    // 1 Crore or more
    return formatCurrency(amount, { unit: "crore", decimals, currency })
  } else if (amount >= 100000) {
    // 1 Lakh or more
    return formatCurrency(amount, { unit: "lakh", decimals, currency })
  } else if (amount >= 10000) {
    // 10K or more
    return formatCurrency(amount, { unit: "K", decimals: 0, currency })
  } else {
    return formatCurrency(amount, { unit: "default", decimals: 0, currency })
  }
}

/**
 * Get compact format (auto-select unit)
 */
export function formatCurrencyCompact(amount: number, currency = "৳"): string {
  return formatCurrencyAuto(amount, { decimals: 1, currency })
}

/**
 * Parse formatted currency back to number
 */
export function parseCurrency(formatted: string): number {
  // Remove currency symbol and whitespace
  let value = formatted.replace(/[৳$,\s]/g, "")
  
  // Check for unit suffix
  const lowerValue = value.toLowerCase()
  let multiplier = 1
  
  if (lowerValue.endsWith("cr")) {
    multiplier = 10000000
    value = value.slice(0, -2)
  } else if (lowerValue.endsWith("l")) {
    multiplier = 100000
    value = value.slice(0, -1)
  } else if (lowerValue.endsWith("m")) {
    multiplier = 1000000
    value = value.slice(0, -1)
  } else if (lowerValue.endsWith("k")) {
    multiplier = 1000
    value = value.slice(0, -1)
  }
  
  return parseFloat(value) * multiplier
}

/**
 * Currency unit options for select dropdown
 */
export const CURRENCY_UNITS: { value: CurrencyUnit; label: string; example: string }[] = [
  { value: "default", label: "Default", example: "৳50,000" },
  { value: "K", label: "Thousands (K)", example: "৳50K" },
  { value: "M", label: "Millions (M)", example: "৳5M" },
  { value: "lakh", label: "Lakh (L)", example: "৳5L" },
  { value: "crore", label: "Crore (Cr)", example: "৳5Cr" },
]
