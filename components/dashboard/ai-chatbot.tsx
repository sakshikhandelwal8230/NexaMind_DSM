"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { MessageCircle, X, Send, Trash2, Plus, Bot, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSupabase } from "@/hooks/useSupabase"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const pathname = usePathname()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { data: medicines } = useSupabase<any>("medicines")

  // Only show on dashboard routes
  if (!pathname.startsWith("/dashboard")) return null

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          text: "Greetings. I am the NexaMind Intelligence Core. I have synchronized with the live pharmaceutical ledger. How can I assist with your supply chain analysis today?",
          isUser: false,
          timestamp: new Date()
        },
      ])
    }
  }, [isOpen, messages.length])

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (viewport) viewport.scrollTop = viewport.scrollHeight
    }
  }, [messages, isTyping])

  const getResponse = (question: string) => {
    const q = question.toLowerCase()

    if (q.includes("critical") || q.includes("zero")) {
      const list = medicines.filter(m => m.current_stock === 0)
      return list.length > 0
        ? `🚨 CRITICAL ALERT: I have detected ${list.length} exhausted assets in your local grid: ${list.map(m => m.name).join(", ")}. Immediate redistribution is advised via the Transfer Protocol.`
        : "✅ Ledger Check: All monitored medical assets are currently above zero-point stock."
    }

    if (q.includes("low") || q.includes("shortage")) {
      const list = medicines.filter(m => m.current_stock > 0 && m.current_stock <= m.min_threshold)
      return list.length > 0
        ? `⚠️ WARNING: ${list.length} items are operating at sub-threshold levels. Notable shortages: ${list.slice(0, 3).map(m => m.name).join(", ")}. Shall I prepare a reorder draft?`
        : "✨ Analysis complete: No sub-threshold shortages detected in current cycle."
    }

    if (q.includes("expiry") || q.includes("expired")) {
      const today = new Date()
      const expired = medicines.filter(m => m.expiry_date && new Date(m.expiry_date) < today)
      return expired.length > 0
        ? `☢️ HAZARD: Detected ${expired.length} expired batches: ${expired.map(m => m.name).join(", ")}. Prohibit distribution immediately.`
        : "🛡️ Safety Scan: No expired assets found in active inventory."
    }

    return "I am specialized in real-time supply chain surveillance. Ask me about 'critical shortages', 'expiry hazards', or 'inventory health'."
  }

  const sendMessage = () => {
    if (!inputValue.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMsg])
    setInputValue("")
    setIsTyping(true)

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: getResponse(inputValue),
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMsg])
      setIsTyping(false)
    }, 800)
  }

  return (
    <>
      <div className="fixed bottom-8 right-8 z-[100]">
        <Button
          size="icon"
          onClick={() => setIsOpen(prev => !prev)}
          className={cn(
            "h-16 w-16 rounded-2xl shadow-2xl transition-all duration-500",
            isOpen ? "bg-slate-900 border-white/10" : "bg-primary text-white hover:scale-110 shadow-primary/20"
          )}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-8 w-8" />}
          {!isOpen && (
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </Button>
      </div>

      {isOpen && (
        <Card className="fixed bottom-28 right-8 z-[100] w-[400px] h-[600px] flex flex-col overflow-hidden shadow-2xl border-white/10 bg-slate-950/90 backdrop-blur-2xl text-white animate-in slide-in-from-bottom-5 duration-300">
          <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-950 border-b border-white/5 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                  <Bot className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <CardTitle className="text-sm font-black uppercase tracking-tight">NexaMind AI Core</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Live Surveillance Active</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8 text-white/50 hover:text-white" onClick={() => setMessages([])}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
            <div className="space-y-6">
              {messages.map(m => (
                <div key={m.id} className={cn("flex gap-3", m.isUser ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center text-xs font-black",
                    m.isUser ? "bg-primary text-white border-primary/50" : "bg-slate-800 border-white/10 border"
                  )}>
                    {m.isUser ? 'U' : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] p-4 text-sm font-medium leading-relaxed shadow-xl",
                    m.isUser
                      ? "bg-primary text-white rounded-2xl rounded-tr-none"
                      : "bg-slate-900 border border-white/5 text-slate-100 rounded-2xl rounded-tl-none"
                  )}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 animate-pulse">
                  <div className="h-8 w-8 bg-slate-800 rounded-lg flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                  <div className="h-10 w-24 bg-slate-900 border border-white/5 rounded-2xl rounded-tl-none flex items-center justify-center">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Thinking...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <CardContent className="p-6 bg-slate-900/50 border-t border-white/10">
            <div className="relative group">
              <Input
                placeholder="Ask about shortages or critical assets..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                className="h-12 bg-slate-950 border-white/10 focus-visible:ring-primary/50 pr-12 text-white font-medium"
              />
              <Button
                size="icon"
                onClick={sendMessage}
                className="absolute right-1.5 top-1.5 h-9 w-9 bg-primary/20 text-primary hover:bg-primary hover:text-white transition-all"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-30 text-center mt-4">NexaMind Intelligence Engine v4.0.2</p>
          </CardContent>
        </Card>
      )}
    </>
  )
}
