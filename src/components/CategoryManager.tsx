import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CategoryManagerProps {
  isOpen: boolean
  onClose: () => void
  categories: string[]
  onAddCategory: (category: string) => void
  onDeleteCategory: (category: string) => void
  itemCategories: string[]
}

export function CategoryManager({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onDeleteCategory,
  itemCategories,
}: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      onAddCategory(newCategory.trim())
      setNewCategory("")
    }
  }

  const canDelete = (category: string) => {
    return !itemCategories.includes(category)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
          <DialogDescription>
            Add or remove categories for organizing your equipment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <form onSubmit={handleSubmit}>
            <Label className="mb-2 block">Add New Category</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
                className="flex-1"
              />
              <Button type="submit" className="gap-2">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
          </form>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Existing Categories
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {categories.map((category) => (
                <div
                  key={category}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <span>{category}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDeleteCategory(category)}
                    disabled={!canDelete(category)}
                    className={
                      canDelete(category)
                        ? "text-red-600 hover:bg-red-50 h-8 w-8"
                        : "text-muted-foreground h-8 w-8"
                    }
                    title={
                      canDelete(category)
                        ? "Delete category"
                        : "Cannot delete — category in use"
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No categories yet. Add your first category above.
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
