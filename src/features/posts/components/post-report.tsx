"use client"

import { MoreHorizontal, Flag } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { reportPost } from "@/features/posts/actions/report-post.action"
import { useState } from "react"
import { toast } from "sonner"

interface PostReportProps {
  postId: string
}

export function PostReport({ postId }: PostReportProps) {
  const [isReporting, setIsReporting] = useState(false)
  const [isReported, setIsReported] = useState(false)

  const handleReport = async () => {
    if (isReporting || isReported) return

    setIsReporting(true)
    try {
      const result = await reportPost(postId)
      
      if (result.success) {
        setIsReported(true)
        const authStatus = result.isAuthenticated 
          ? `(connecté${result.userEmail ? ` en tant que ${result.userEmail}` : ''})`
          : "(utilisateur anonyme)"
        
        toast.success(`Post signalé avec succès ${authStatus}`)
      } else {
        const authStatus = result.isAuthenticated 
          ? `(connecté${result.userEmail ? ` en tant que ${result.userEmail}` : ''})`
          : "(utilisateur anonyme)"
        
        toast.error(`Échec du signalement: ${result.error} ${authStatus}`)
      }
    } catch (error) {
      console.error("Failed to report post:", error)
      toast.error("Une erreur inattendue s'est produite lors du signalement")
    } finally {
      setIsReporting(false)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button 
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Actions"
        >
          <MoreHorizontal className="h-4 w-4 text-gray-500" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0" align="end">
        <div className="p-2">
          <button
            onClick={handleReport}
            disabled={isReporting || isReported}
            className="flex items-center w-full px-2 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Flag className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">
              {isReporting ? "Signalement..." : isReported ? "Signalé" : "Signaler"}
            </span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}