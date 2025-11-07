import { useAppStore } from "@/store/app-store"
import { formatCurrency, formatCurrencyAuto, formatCurrencyCompact, type CurrencyUnit } from "@/lib/currency-formatter"

export function useCurrency() {
  const { currencyUnit } = useAppStore()

  return {
    currencyUnit,
    format: (amount: number, options?: { compact?: boolean; unit?: CurrencyUnit }) => {
      const unit = options?.unit || (currencyUnit as CurrencyUnit)
      if (options?.compact) {
        return formatCurrencyCompact(amount, unit)
      }
      return formatCurrency(amount, { unit })
    },
    formatAuto: (amount: number) => {
      return formatCurrencyAuto(amount)
    },
    formatCompact: (amount: number, options?: { unit?: CurrencyUnit }) => {
      return formatCurrencyCompact(amount, (options?.unit || currencyUnit) as CurrencyUnit)
    },
  }
}
