"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface Mention {
  id: string
  name: string
  usageCount: number
}

interface MentionInputProps {
  value: string
  onChange: (value: string) => void
  onMentionsChange: (mentions: string[]) => void
  placeholder?: string
  className?: string
}

export function MentionInput({
  value,
  onChange,
  onMentionsChange,
  placeholder = "Write your message...",
  className,
}: MentionInputProps) {
  const [suggestions, setSuggestions] = useState<Mention[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [currentMention, setCurrentMention] = useState("")
  const [mentionStart, setMentionStart] = useState(-1)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g
    const mentions: string[] = []
    let match
    
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1])
    }
    
    return mentions
  }

  const fetchSuggestions = async (query: string) => {
    if (query.length < 1) {
      setSuggestions([])
      return
    }

    try {
      const response = await fetch(`/api/mentions?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data)
      }
    } catch (error) {
      console.error("Failed to fetch mentions:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const cursorPosition = e.target.selectionStart
    
    onChange(newValue)
    onMentionsChange(extractMentions(newValue))

    // Check if we're typing a mention
    const textBeforeCursor = newValue.slice(0, cursorPosition)
    const lastAtIndex = textBeforeCursor.lastIndexOf("@")
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1)
      
      // Check if we're still in the same word (no spaces)
      if (!textAfterAt.includes(" ") && !textAfterAt.includes("\n")) {
        setCurrentMention(textAfterAt)
        setMentionStart(lastAtIndex)
        setShowSuggestions(true)
        setSelectedIndex(0)
        fetchSuggestions(textAfterAt)
      } else {
        setShowSuggestions(false)
      }
    } else {
      setShowSuggestions(false)
    }
  }

  const insertMention = (mention: Mention) => {
    if (!textareaRef.current || mentionStart === -1) return

    const before = value.slice(0, mentionStart)
    const after = value.slice(mentionStart + currentMention.length + 1)
    const newValue = `${before}@${mention.name} ${after}`
    
    onChange(newValue)
    onMentionsChange(extractMentions(newValue))
    setShowSuggestions(false)
    
    // Focus back to textarea
    setTimeout(() => {
      textareaRef.current?.focus()
      const newCursorPosition = mentionStart + mention.name.length + 2
      textareaRef.current?.setSelectionRange(newCursorPosition, newCursorPosition)
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % suggestions.length)
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length)
        break
      case "Enter":
        e.preventDefault()
        insertMention(suggestions[selectedIndex])
        break
      case "Escape":
        setShowSuggestions(false)
        break
    }
  }

  useEffect(() => {
    if (showSuggestions && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[selectedIndex] as HTMLElement
      selectedElement?.scrollIntoView({ block: "nearest" })
    }
  }, [selectedIndex, showSuggestions])

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 mt-1 max-h-40 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
        >
          {suggestions.map((mention, index) => (
            <div
              key={mention.id}
              className={cn(
                "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                index === selectedIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => insertMention(mention)}
            >
              <span className="font-medium">@{mention.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {mention.usageCount}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}