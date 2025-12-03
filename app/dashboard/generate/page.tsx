import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AIRecipeGenerator } from "@/components/ai-recipe-generator"

export default async function GeneratePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-amber-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Recipe Generator</h1>
          <p className="text-muted-foreground">Let AI create a custom recipe based on your preferences</p>
        </div>
        <AIRecipeGenerator userId={user.id} />
      </div>
    </div>
  )
}
