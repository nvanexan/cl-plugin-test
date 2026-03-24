import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { AddItemForm } from "@/components/AddItemForm"
import type { Item } from "@/App"

interface AddItemDialogProps {
  isOpen: boolean
  onClose: () => void
  categories: string[]
  onAdd: (item: Omit<Item, "id" | "included">) => void
  editItem?: Item
  onUpdate?: (id: string, updates: Partial<Item>) => void
  taxRate: number
}

export function AddItemDialog({
  isOpen,
  onClose,
  categories,
  onAdd,
  editItem,
  onUpdate,
  taxRate,
}: AddItemDialogProps) {
  const handleAdd = (item: Omit<Item, "id" | "included">) => {
    onAdd(item)
    onClose()
  }

  const handleUpdate = (id: string, updates: Partial<Item>) => {
    onUpdate?.(id, updates)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editItem ? "Edit Equipment" : "Add Equipment"}
          </DialogTitle>
          <DialogDescription>
            {editItem
              ? "Update the details for this item."
              : "Add a new piece of equipment to your list."}
          </DialogDescription>
        </DialogHeader>
        <AddItemForm
          categories={categories}
          onAdd={handleAdd}
          editItem={editItem}
          onUpdate={handleUpdate}
          taxRate={taxRate}
        />
      </DialogContent>
    </Dialog>
  )
}
