"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Share2, Heart } from "lucide-react"

interface MilestoneEvent {
  type: "achievement" | "milestone" | "streak" | "leaderboard"
  title: string
  description: string
  icon: string
  color: string
  ctaText?: string
  onCTA?: () => void
}

interface MilestoneCelebrationProps {
  event: MilestoneEvent
  onClose: () => void
}

export function MilestoneCelebration({
  event,
  onClose,
}: MilestoneCelebrationProps) {
  const [animate, setAnimate] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setAnimate(true)
    setShowConfetti(true)

    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Generate confetti pieces
  const confettiPieces = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1,
  }))

  return (
    <>
      {/* Confetti Background */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {confettiPieces.map(piece => (
            <div
              key={piece.id}
              className="absolute w-2 h-2 animate-pulse"
              style={{
                left: `${piece.left}%`,
                top: "-10px",
                animation: `fall ${piece.duration}s linear infinite`,
                animationDelay: `${piece.delay}s`,
                backgroundColor: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f7b731", "#5f27cd"][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <div className={`fixed inset-0 flex items-center justify-center z-50 pointer-events-auto ${animate ? "animate-in fade-in zoom-in" : ""}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

        {/* Card */}
        <Card className={`relative w-full max-w-md mx-4 p-8 space-y-6 ${event.color} border-2 transform transition-all ${animate ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="text-center">
            <div className="text-7xl mx-auto w-24 h-24 flex items-center justify-center animate-bounce">
              {event.icon}
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-2">
            <Badge className="mx-auto block w-fit" variant="secondary">
              🎉 {event.type === "achievement" ? "Achievement Unlocked!" : event.type === "streak" ? "Streak Milestone!" : "Milestone Reached!"}
            </Badge>
            <h2 className="text-3xl font-bold">{event.title}</h2>
            <p className="text-sm text-muted-foreground">{event.description}</p>
          </div>

          {/* Special Effects for Different Types */}
          {event.type === "leaderboard" && (
            <div className="bg-white/30 dark:bg-black/30 p-4 rounded-lg text-center">
              <p className="font-bold text-lg">🏆 You Made the Leaderboard! 🏆</p>
              <p className="text-xs text-muted-foreground mt-1">
                Your impact is recognized by the community
              </p>
            </div>
          )}

          {event.type === "streak" && (
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white/30 dark:bg-black/30 p-3 rounded-lg text-center">
                  <div className="text-2xl">🔥</div>
                  <p className="text-xs font-semibold mt-1">{i}x Streak</p>
                </div>
              ))}
            </div>
          )}

          {event.type === "achievement" && (
            <div className="bg-white/30 dark:bg-black/30 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                You've unlocked special perks and recognition. Keep it up! 🌟
              </p>
            </div>
          )}

          {event.type === "milestone" && (
            <div className="bg-white/30 dark:bg-black/30 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                Huge impact! 💚
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Your donations are changing lives. Thank you!
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {event.ctaText && event.onCTA && (
              <Button
                onClick={event.onCTA}
                className="w-full gap-2"
                size="lg"
              >
                {event.ctaText}
              </Button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  const text = `Just unlocked: ${event.title}! 🎉 Join me on Shurokkha - transparent donation platform with AI verification.`
                  navigator.clipboard.writeText(text)
                }}
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="gap-2"
              >
                <Heart className="w-4 h-4" />
                Continue
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}

export default MilestoneCelebration
