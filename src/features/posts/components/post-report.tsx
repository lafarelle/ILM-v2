"use client"

import { MoreHorizontal, Flag, Trash2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"
import { reportPost } from "@/features/posts/actions/report-post.action"
import { deletePost } from "@/features/posts/actions/delete-post.action"
import { checkPostOwnership } from "@/features/posts/queries/check-post-ownership.action"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import type { PostReportProps } from "@/features/posts/schemas"

export function PostReport({ postId, onPostDeleted }: PostReportProps) {
  const [isReporting, setIsReporting] = useState(false)
  const [isReported, setIsReported] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    const checkOwnership = async () => {
      try {
        const result = await checkPostOwnership(postId)
        setIsOwner(result.isOwner)
        setIsAuthenticated(result.isAuthenticated)
      } catch (error) {
        console.error("Failed to check post ownership:", error)
      }
    }

    checkOwnership()
  }, [postId])

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

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (isDeleting) return

    setIsDeleting(true)
    setShowDeleteDialog(false)
    try {
      const result = await deletePost(postId)
      
      if (result.success) {
        toast.success("Post supprimé avec succès")
        onPostDeleted?.()
      } else {
        const authStatus = result.isAuthenticated 
          ? `(connecté${result.userEmail ? ` en tant que ${result.userEmail}` : ''})`
          : "(utilisateur anonyme)"
        
        toast.error(`Échec de la suppression: ${result.error} ${authStatus}`)
      }
    } catch (error) {
      console.error("Failed to delete post:", error)
      toast.error("Une erreur inattendue s'est produite lors de la suppression")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
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
          {isOwner && isAuthenticated && (
            <>
              <button
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="flex items-center w-full px-2 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-red-600 dark:text-red-400"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <span>
                  {isDeleting ? "Suppression..." : "Supprimer"}
                </span>
              </button>
              <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
            </>
          )}
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

    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer le post</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer ce post ? Cette action est irréversible et supprimera définitivement le contenu ainsi que tous les commentaires associés.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDeleteConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}