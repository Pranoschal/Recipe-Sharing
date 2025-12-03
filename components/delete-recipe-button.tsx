"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeleteRecipeButton({ recipeId }: { recipeId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this recipe?")) return

    setIsDeleting(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("recipes").delete().eq("id", recipeId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error deleting recipe:", error)
      alert("Failed to delete recipe")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button size="sm" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
      <Trash2 className="h-3 w-3" />
    </Button>
  )
}
