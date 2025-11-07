"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatbotModal } from "./chatbot-modal"
import { useAppStore } from "@/store/app-store"

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated } = useAppStore()

  // Only show the button when user is authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 p-0 animate-pulse hover:animate-none"
        size="icon"
        aria-label="Open AI Assistant"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>

      <ChatbotModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
