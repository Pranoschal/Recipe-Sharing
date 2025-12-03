"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState(value)

  const handleUrlChange = (url: string) => {
    setPreviewUrl(url)
    onChange(url)
  }

  const clearImage = () => {
    setPreviewUrl("")
    onChange("")
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Recipe Image URL</Label>
        <div className="flex gap-2">
          <Input
            id="imageUrl"
            type="url"
            value={previewUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          {previewUrl && (
            <Button type="button" variant="outline" size="icon" onClick={clearImage}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {previewUrl && (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border">
          <img
            src={previewUrl || "/placeholder.svg"}
            alt="Recipe preview"
            className="w-full h-full object-cover"
            onError={() => {
              setPreviewUrl("")
              onChange("")
            }}
          />
        </div>
      )}

      {!previewUrl && (
        <div className="w-full h-64 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Upload className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Enter an image URL to see preview</p>
          </div>
        </div>
      )}
    </div>
  )
}
