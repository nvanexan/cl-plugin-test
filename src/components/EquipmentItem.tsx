import { useState, useRef, useEffect } from "react"
import { Trash2, ExternalLink, Check, X, Edit2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Item } from "@/App"

interface EquipmentItemProps {
  item: Item
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<Item>) => void
  onEdit: (id: string) => void
  categories: string[]
  taxRate: number
}

export function EquipmentItem({
  item,
  onToggle,
  onDelete,
  onUpdate,
  onEdit,
  categories,
  taxRate,
}: EquipmentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(item.name)
  const [editedCategory, setEditedCategory] = useState(item.category)
  const [editedPrice, setEditedPrice] = useState(item.price.toString())
  const [editedLink, setEditedLink] = useState(item.link || "")
  const [editedTaxable, setEditedTaxable] = useState(item.taxable)

  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && nameInputRef.current) {
      nameInputRef.current.focus()
      nameInputRef.current.select()
    }
  }, [isEditing])

  const taxMultiplier = 1 + taxRate / 100
  const priceWithTax = item.price * (item.taxable ? taxMultiplier : 1)

  const handleSave = () => {
    const price = parseFloat(editedPrice)
    if (!editedName.trim() || isNaN(price) || price < 0) return

    onUpdate(item.id, {
      name: editedName.trim(),
      category: editedCategory,
      price,
      link: editedLink.trim() || undefined,
      taxable: editedTaxable,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedName(item.name)
    setEditedCategory(item.category)
    setEditedPrice(item.price.toString())
    setEditedLink(item.link || "")
    setEditedTaxable(item.taxable)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave()
    else if (e.key === "Escape") handleCancel()
  }

  if (isEditing) {
    return (
      <div className="px-4 py-3 rounded-lg bg-blue-50 border border-blue-200">
        {/* Mobile Layout */}
        <div className="md:hidden space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={item.included}
              onCheckedChange={() => onToggle(item.id)}
            />
            <Input
              ref={nameInputRef}
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 h-8 text-sm"
              placeholder="Item name"
            />
          </div>
          <select
            value={editedCategory}
            onChange={(e) => setEditedCategory(e.target.value)}
            className="w-full h-8 px-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">No category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground block mb-1">Price</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={editedPrice}
                onChange={(e) => setEditedPrice(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-8 text-sm"
                placeholder="0.00"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm pb-1">
                <Checkbox
                  checked={editedTaxable}
                  onCheckedChange={(checked) => setEditedTaxable(checked === true)}
                />
                <span className="text-muted-foreground">Tax</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700 gap-1">
              <Check className="w-4 h-4" /> Save
            </Button>
            <Button size="sm" variant="secondary" onClick={handleCancel} className="gap-1">
              <X className="w-4 h-4" /> Cancel
            </Button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
          <div className="col-span-1">
            <Checkbox
              checked={item.included}
              onCheckedChange={() => onToggle(item.id)}
            />
          </div>
          <div className="col-span-4">
            <Input
              ref={nameInputRef}
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 text-sm"
              placeholder="Item name"
            />
          </div>
          <div className="col-span-2">
            <select
              value={editedCategory}
              onChange={(e) => setEditedCategory(e.target.value)}
              className="w-full h-8 px-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              step="0.01"
              min="0"
              value={editedPrice}
              onChange={(e) => setEditedPrice(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 text-sm"
              placeholder="0.00"
            />
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={editedTaxable}
                onCheckedChange={(checked) => setEditedTaxable(checked === true)}
              />
              <span className="text-muted-foreground">Taxable</span>
            </label>
          </div>
          <div className="col-span-1 flex gap-1 justify-end">
            <Button size="icon" variant="ghost" onClick={handleSave} className="text-green-600 hover:bg-green-50 h-8 w-8" title="Save">
              <Check className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleCancel} className="text-muted-foreground hover:bg-muted h-8 w-8" title="Cancel">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`px-4 py-3 rounded-lg transition-colors cursor-pointer ${
        item.included
          ? "bg-white hover:bg-gray-50"
          : "bg-gray-50 opacity-60 hover:bg-gray-100"
      }`}
      onClick={() => setIsEditing(true)}
    >
      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="flex items-start gap-3 mb-2">
          <div className="mt-0.5" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={item.included}
              onCheckedChange={() => onToggle(item.id)}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-medium ${!item.included ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {item.name}
              </span>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                  title="View link"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
            {item.category && (
              <div className="text-sm text-muted-foreground mb-2">{item.category}</div>
            )}
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Price: </span>
                <span className={`font-medium ${!item.included ? "text-muted-foreground" : ""}`}>
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">+ Tax: </span>
                <span className={`font-medium ${!item.included ? "text-muted-foreground" : "text-blue-600"}`}>
                  ${priceWithTax.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" variant="ghost" onClick={() => onEdit(item.id)} className="text-blue-600 hover:bg-blue-50 gap-1 h-7">
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete(item.id)} className="text-red-600 hover:bg-red-50 gap-1 h-7">
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </Button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
        <div className="col-span-1" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={item.included}
            onCheckedChange={() => onToggle(item.id)}
          />
        </div>
        <div className="col-span-4">
          <div className="flex items-center gap-2">
            <span className={`${!item.included ? "line-through text-muted-foreground" : ""}`}>
              {item.name}
            </span>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
                title="View link"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
        <div className="col-span-2">
          <span className="text-sm text-muted-foreground">{item.category}</span>
        </div>
        <div className="col-span-2">
          <span className={`font-medium ${!item.included ? "text-muted-foreground" : ""}`}>
            ${item.price.toFixed(2)}
          </span>
        </div>
        <div className="col-span-2">
          <span className={`font-medium ${!item.included ? "text-muted-foreground" : ""}`}>
            ${priceWithTax.toFixed(2)}
          </span>
        </div>
        <div className="col-span-1 flex gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
          <Button size="icon" variant="ghost" onClick={() => onEdit(item.id)} className="text-blue-600 hover:bg-blue-50 h-8 w-8" title="Edit details">
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => onDelete(item.id)} className="text-red-600 hover:bg-red-50 h-8 w-8" title="Delete">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
