import { Plus, DollarSign, Edit2, Filter, FolderCog, Download, Upload } from "lucide-react"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command"
import type { Item } from "@/App"

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onAddItem: () => void
  onEditBudget: () => void
  onEditItem: (id: string) => void
  onSelectCategory: (category: string) => void
  onManageCategories: () => void
  onExport: () => void
  onImport: () => void
  items: Item[]
  categories: string[]
  currentCategory: string
}

export function CommandPalette({
  isOpen,
  onClose,
  onAddItem,
  onEditBudget,
  onEditItem,
  onSelectCategory,
  onManageCategories,
  onExport,
  onImport,
  items,
  categories,
  currentCategory,
}: CommandPaletteProps) {
  return (
    <CommandDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => { onAddItem(); onClose() }}
          >
            <Plus className="text-blue-600" />
            <div className="flex-1">
              <div className="font-medium">Add Item</div>
              <div className="text-xs text-muted-foreground">Add new equipment to your list</div>
            </div>
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => { onEditBudget(); onClose() }}
          >
            <DollarSign className="text-green-600" />
            <div className="flex-1">
              <div className="font-medium">Edit Budget</div>
              <div className="text-xs text-muted-foreground">Set or update your budget</div>
            </div>
          </CommandItem>

          <CommandItem
            onSelect={() => { onManageCategories(); onClose() }}
          >
            <FolderCog className="text-muted-foreground" />
            <div className="flex-1">
              <div className="font-medium">Manage Categories</div>
              <div className="text-xs text-muted-foreground">Add or remove categories</div>
            </div>
          </CommandItem>

          <CommandItem
            onSelect={() => { onExport(); onClose() }}
          >
            <Download className="text-muted-foreground" />
            <div className="flex-1">
              <div className="font-medium">Export Data</div>
              <div className="text-xs text-muted-foreground">Download data as JSON file</div>
            </div>
          </CommandItem>

          <CommandItem
            onSelect={() => { onImport(); onClose() }}
          >
            <Upload className="text-muted-foreground" />
            <div className="flex-1">
              <div className="font-medium">Import Data</div>
              <div className="text-xs text-muted-foreground">Restore data from JSON file</div>
            </div>
          </CommandItem>
        </CommandGroup>

        {items.length > 0 && (
          <CommandGroup heading="Edit Items">
            {items.map((item) => (
              <CommandItem
                key={item.id}
                value={`edit ${item.name}`}
                onSelect={() => { onEditItem(item.id); onClose() }}
              >
                <Edit2 className="text-purple-600" />
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.category || "No category"} — ${item.price.toFixed(2)}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {categories.length > 0 && (
          <CommandGroup heading="Filter by Category">
            {categories.map((category) => (
              <CommandItem
                key={category}
                value={`filter ${category}`}
                onSelect={() => { onSelectCategory(category); onClose() }}
              >
                <Filter className="text-muted-foreground" />
                <div className="flex-1">
                  <div className="font-medium">{category}</div>
                  <div className="text-xs text-muted-foreground">
                    {currentCategory === category ? "Currently selected" : "Select filter"}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
