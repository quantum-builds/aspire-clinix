"use client"

import { useState } from "react"
import { ChevronUp } from "lucide-react"

export default function dropDown() {
  const [isOpen, setIsOpen] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)

  const items = ["Item 1", "Item 2", "Item 3"]

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-48">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-3 py-2 border border-border rounded-t bg-white text-sm text-muted-foreground"
          >
            <span>{selected || "Select"}</span>
            <ChevronUp
              className={`h-4 w-4 transition-transform ${isOpen ? "" : "rotate-180"}`}
            />
          </button>

          {/* Dropdown menu */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 border border-t-0 border-border rounded-b bg-white z-10">
              {items.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setSelected(item)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-muted/50 transition-colors ${
                    selected === item
                      ? "border-l-2 border-l-blue-500 bg-blue-50/50"
                      : "border-l-2 border-l-transparent"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
