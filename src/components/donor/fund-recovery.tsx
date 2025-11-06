"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, CheckCircle, Clock, TrendingDown } from "lucide-react"

interface FundRecoveryMetrics {
  totalDonated: number
  allocated: number
  available: number
  fees: number
}

interface DonorFundRecoveryProps {
  metrics: FundRecoveryMetrics
}

export default function DonorFundRecovery({ metrics }: DonorFundRecoveryProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [autoRefund, setAutoRefund] = useState(true)
  const [refundDays, setRefundDays] = useState(60)
  const [withdrawalAmount, setWithdrawalAmount] = useState(metrics.available.toString())
  const [isProcessing, setIsProcessing] = useState(false)

  const handleWithdrawal = async () => {
    const amount = Number(withdrawalAmount)
    if (!amount || amount <= 0 || amount > metrics.available) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount within available funds",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsProcessing(false)

    toast({
      title: "Withdrawal Initiated",
      description: `৳${amount.toLocaleString()} withdrawal request submitted. Processing takes 2-5 business days.`,
    })
  }

  const handleSaveAutoRefund = () => {
    toast({
      title: "Settings Saved",
      description: `Auto-refund enabled for ${refundDays} days of inactivity`,
    })
  }

  const handleReallocate = () => {
    router.push("/donate/new")
  }

  return (
    <div className="space-y-6">
      {/* Current status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <span className="text-xs font-semibold text-foreground/60 uppercase">Unallocated</span>
          </div>
          <p className="text-2xl font-bold text-foreground">৳{metrics.available.toLocaleString()}</p>
          <p className="text-xs text-foreground/60 mt-2">Ready to withdraw or reallocate</p>
        </div>

        <div className="bg-card border border-border/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="text-xs font-semibold text-foreground/60 uppercase">Locked in Escrow</span>
          </div>
          <p className="text-2xl font-bold text-foreground">৳{metrics.allocated.toLocaleString()}</p>
          <p className="text-xs text-foreground/60 mt-2">Committed to active distributions</p>
        </div>

        <div className="bg-card border border-border/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-xs font-semibold text-foreground/60 uppercase">Utilization Rate</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {metrics.totalDonated > 0 ? ((metrics.allocated / metrics.totalDonated) * 100).toFixed(0) : 0}%
          </p>
          <p className="text-xs text-foreground/60 mt-2">Of total donated funds</p>
        </div>
      </div>

      {/* Manual withdrawal */}
      <div className="bg-card border border-border/50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Manual Withdrawal</h3>
        <p className="text-sm text-foreground/70 mb-4">
          Withdraw your unallocated funds anytime. Processing usually takes 2-5 business days.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Withdrawal Amount (৳)</label>
            <input
              type="number"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              max={metrics.available}
              className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-xs text-foreground/60 mt-2">Maximum available: ৳{metrics.available.toLocaleString()}</p>
          </div>

          <button
            onClick={handleWithdrawal}
            disabled={
              !withdrawalAmount ||
              Number(withdrawalAmount) <= 0 ||
              Number(withdrawalAmount) > metrics.available ||
              isProcessing
            }
            className="w-full px-4 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-lg font-semibold transition-colors"
          >
            {isProcessing ? "Processing..." : `Withdraw ৳${Number(withdrawalAmount || 0).toLocaleString()}`}
          </button>
        </div>
      </div>

      {/* Auto-refund settings */}
      <div className="bg-card border border-border/50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">Auto-Refund Settings</h3>
            <p className="text-sm text-foreground/70 mt-1">
              Automatically return unallocated funds after specified days
            </p>
          </div>
          <button
            onClick={() => setAutoRefund(!autoRefund)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              autoRefund ? "bg-primary" : "bg-border/50"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                autoRefund ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {autoRefund && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Auto-Refund After (days)</label>
              <div className="grid grid-cols-4 gap-2">
                {[30, 60, 90, 180].map((days) => (
                  <button
                    key={days}
                    onClick={() => setRefundDays(days)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      refundDays === days
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border border-border/50 hover:border-primary/50 text-foreground"
                    }`}
                  >
                    {days}d
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-xs text-blue-700">
              <p className="font-semibold mb-1">How it works:</p>
              <p>
                Any unallocated funds will automatically be returned to your account after {refundDays} days of
                inactivity.
              </p>
            </div>

            <button
              onClick={handleSaveAutoRefund}
              className="w-full px-4 py-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg font-semibold transition-colors"
            >
              Save Auto-Refund Settings
            </button>
          </div>
        )}
      </div>

      {/* Reallocation */}
      <div className="bg-card border border-border/50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Re-allocate Funds</h3>
        <p className="text-sm text-foreground/70 mb-4">
          Transfer your unallocated funds to different crises or providers.
        </p>
        <button
          onClick={handleReallocate}
          className="w-full px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg font-semibold transition-colors"
        >
          Find New Crises
        </button>
      </div>

      {/* Info box */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-700">
          <p className="font-semibold mb-1">Fund Security</p>
          <p>
            Your allocated funds are locked in escrow until distribution is verified by our AI system. This ensures
            maximum transparency and protection.
          </p>
        </div>
      </div>
    </div>
  )
}
