import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import type { Item } from "@/App"

interface AddItemFormProps {
  categories: string[]
  onAdd: (item: Omit<Item, "id" | "included">) => void
  editItem?: Item
  onUpdate?: (id: string, updates: Partial<Item>) => void
  taxRate: number
}

export function AddItemForm({ categories, onAdd, editItem, onUpdate, taxRate }: AddItemFormProps) {
  const [name, setName] = useState(editItem?.name || "")
  const [category, setCategory] = useState(editItem?.category || "")
  const [price, setPrice] = useState(editItem?.price.toString() || "")
  const [link, setLink] = useState(editItem?.link || "")
  const [taxable, setTaxable] = useState(editItem?.taxable ?? true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && price) {
      const itemData = {
        name: name.trim(),
        category,
        price: parseFloat(price),
        link: link.trim() || undefined,
        taxable,
      }

      if (editItem && onUpdate) {
        onUpdate(editItem.id, itemData)
      } else {
        onAdd(itemData)
      }

      setName("")
      setPrice("")
      setLink("")
      setTaxable(true)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="item-name">Item Name</Label>
        <Input
          id="item-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Blue Yeti Microphone"
          required
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          style={{ paddingRight: "2rem" }}
        >
          <option value="">No category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">$</span>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            style={{ paddingLeft: "1.75rem" }}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="link">Link (optional)</Label>
        <Input
          id="link"
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="taxable"
          checked={taxable}
          onCheckedChange={(checked) => setTaxable(checked === true)}
        />
        <Label htmlFor="taxable" className="cursor-pointer">
          Calculate tax ({taxRate}%)
        </Label>
      </div>

      <Button type="submit" className="w-full gap-2">
        <Plus className="w-4 h-4" />
        {editItem ? "Update Item" : "Add Item"}
      </Button>
    </form>
  )
}
