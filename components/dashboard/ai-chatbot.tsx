"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { MessageCircle, X, Send, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock inventory data (UI demo only)
const mockInventory = [
  { name: "Paracetamol 500mg", status: "adequate", quantity: 2500 },
  { name: "Amoxicillin 250mg", status: "critical", quantity: 15 },
  { name: "Ibuprofen 200mg", status: "low", quantity: 80 },
]

interface Message {
  id: string
  text: string
  isUser: boolean
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const pathname = usePathname()
  const bottomRef = useRef<HTMLDivElement>(null)

  // Sirf dashboard pages pe
  if (!pathname.startsWith("/dashboard")) return null

  // Welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          text: "👋 Hi! I’m your Healthcare Supply Assistant. Ask me about critical medicines, shortages, emergency mode, or supply transfers.",
          isUser: false,
        },
      ])
    }
  }, [isOpen, messages.length])

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // AI demo logic
  const getResponse = (question: string) => {
    const q = question.toLowerCase()

    if (q.includes("critical")) {
      const critical = mockInventory.filter(i => i.status === "critical")
      return critical.length
        ? `🤖 AI insight: ${critical.map(i => i.name).join(", ")} are critical due to rapid stock drop. Immediate redistribution recommended.`
        : "🤖 AI insight: No medicines are critical right now."
    }

    if (q.includes("low")) {
      const low = mockInventory.filter(i => i.status === "low")
      return low.length
        ? `🤖 AI insight: Low stock detected for ${low.map(i => i.name).join(", ")}.`
        : "🤖 AI insight: No medicines are currently low."
    }

    if (q.includes("emergency")) {
      return "🤖 AI insight: Emergency mode highlights critical medicines and speeds up decision-making."
    }

    if (q.includes("request") || q.includes("supply")) {
      return "🤖 AI insight: Go to Transfers → select medicine → choose destination → submit request."
    }

    return "🤖 I can help with shortages, emergency mode, redistribution, and dashboard guidance."
  }

  const sendMessage = () => {
    if (!inputValue.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
    }

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: getResponse(inputValue),
      isUser: false,
    }

    setMessages(prev => [...prev, userMsg, aiMsg])
    setInputValue("")
  }

  const clearChat = () => setMessages([])

  const newChat = () =>
    setMessages([
      {
        id: "new",
        text: "👋 New chat started. How can I help?",
        isUser: false,
      },
    ])

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-9999">
        <Button
          size="icon"
          onClick={() => setIsOpen(prev => !prev)}
          className="h-14 w-14 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-xl"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-9999 w-[360px] max-w-[95vw]">
          <Card className="h-[520px] flex flex-col overflow-hidden shadow-2xl">

            {/* Header */}
            <CardHeader className="flex flex-row items-center justify-between border-b px-4 py-3">
              <div>
                <CardTitle className="text-sm">Healthcare AI Assistant</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Operational insights (UI demo)
                </p>
              </div>

              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={newChat}>
                  <Plus className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={clearChat}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {/* Messages (SCROLL FIXED HERE) */}
            <ScrollArea className="h-[340px] px-4 py-3 overflow-y-auto">
              <div className="space-y-3">
                {messages.map(m => (
                  <div
                    key={m.id}
                    className={`flex ${m.isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        m.isUser
                          ? "bg-teal-600 text-white"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t p-3 bg-background">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about shortages, emergency mode…"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                />
                <Button size="icon" onClick={sendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

          </Card>
        </div>
      )}
    </>
  )
}
