import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { BudgetTracker } from "@/components/BudgetTracker"
import { EquipmentItem } from "@/components/EquipmentItem"
import { AddItemDialog } from "@/components/AddItemDialog"
import { BudgetDialog } from "@/components/BudgetDialog"
import { CommandPalette } from "@/components/CommandPalette"
import { CategoryManager } from "@/components/CategoryManager"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"

export interface Item {
  id: string
  name: string
  category: string
  price: number
  link?: string
  included: boolean
  taxable: boolean
}

interface AppState {
  items: Item[]
  budget: number
  projectName: string
  categories: string[]
  taxRate: number
}

type SortColumn = "name" | "category" | "price" | "priceTax"
type SortDirection = "asc" | "desc"

export default function App() {
  const [items, setItems] = useLocalStorage<Item[]>("budget-items", [])
  const [budget, setBudget] = useLocalStorage<number>("budget-amount", 0)
  const [projectName, setProjectName] = useLocalStorage<string>("budget-project-name", "Project Budget")
  const [categories, setCategories] = useLocalStorage<string[]>("budget-categories", [])
  const [taxRate, setTaxRate] = useLocalStorage<number>("budget-tax-rate", 13)

  const [selectedCategory, setSelectedCategory] = useLocalStorage<string>("budget-selected-category", "All")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsCommandPaletteOpen(true)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault()
        setIsModalOpen(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [setIsCommandPaletteOpen, setIsModalOpen])

  const addItem = useCallback((item: Omit<Item, "id" | "included">) => {
    const newItem: Item = {
      ...item,
      id: Date.now().toString(),
      included: true,
    }
    setItems((prev) => [...prev, newItem])
  }, [setItems])

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [setItems])

  const updateItem = useCallback((id: string, updates: Partial<Item>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
    setEditingItemId(null)
  }, [setItems, setEditingItemId])

  const handleEditItem = useCallback((id: string) => {
    setEditingItemId(id)
    setIsModalOpen(true)
  }, [setEditingItemId, setIsModalOpen])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setEditingItemId(null)
  }, [setIsModalOpen, setEditingItemId])

  const toggleIncluded = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, included: !item.included } : item
      )
    )
  }, [setItems])

  // Export data as JSON
  const handleExport = useCallback(() => {
    const data: AppState = { items, budget, projectName, categories, taxRate }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${projectName.replace(/\s+/g, "-").toLowerCase()}-budget.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [items, budget, projectName, categories, taxRate])

  // Import data from JSON
  const handleImport = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as AppState
        if (data.items) setItems(data.items)
        if (typeof data.budget === "number") setBudget(data.budget)
        if (data.projectName) setProjectName(data.projectName)
        if (data.categories) setCategories(data.categories)
        if (typeof data.taxRate === "number") setTaxRate(data.taxRate)
      } catch {
        alert("Invalid JSON file. Please select a valid budget export.")
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }, [setItems, setBudget, setProjectName, setCategories, setTaxRate])

  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.category === selectedCategory)

  const allIncludedState = useMemo((): boolean | "indeterminate" => {
    if (filteredItems.length === 0) return false
    const allIncluded = filteredItems.every((item) => item.included)
    const noneIncluded = filteredItems.every((item) => !item.included)
    if (allIncluded) return true
    if (noneIncluded) return false
    return "indeterminate"
  }, [filteredItems])

  const toggleAllIncluded = useCallback(() => {
    const filteredIds = new Set(filteredItems.map((item) => item.id))
    const newIncluded = allIncludedState !== true
    setItems((prev) =>
      prev.map((item) =>
        filteredIds.has(item.id) ? { ...item, included: newIncluded } : item
      )
    )
  }, [filteredItems, allIncludedState, setItems])

  const taxMultiplier = 1 + taxRate / 100

  const handleSort = useCallback((column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }, [sortColumn])

  const sortedItems = useMemo(() => {
    if (!sortColumn) return filteredItems
    return [...filteredItems].sort((a, b) => {
      let cmp = 0
      switch (sortColumn) {
        case "name":
          cmp = a.name.localeCompare(b.name)
          break
        case "category":
          cmp = a.category.localeCompare(b.category)
          break
        case "price":
          cmp = a.price - b.price
          break
        case "priceTax":
          cmp =
            a.price * (a.taxable ? taxMultiplier : 1) -
            b.price * (b.taxable ? taxMultiplier : 1)
          break
      }
      return sortDirection === "asc" ? cmp : -cmp
    })
  }, [filteredItems, sortColumn, sortDirection, taxMultiplier])
  const totalCost = items
    .filter((item) => item.included)
    .reduce((sum, item) => sum + item.price * (item.taxable ? taxMultiplier : 1), 0)

  const categoryBreakdown = items
    .filter((item) => item.included)
    .reduce<Record<string, number>>((acc, item) => {
      const category = item.category || "Uncategorized"
      const cost = item.price * (item.taxable ? taxMultiplier : 1)
      acc[category] = (acc[category] || 0) + cost
      return acc
    }, {})

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="mb-8">
          <BudgetTracker
            budget={budget}
            totalCost={totalCost}
            onEditBudget={() => setIsBudgetModalOpen(true)}
            onAddEquipment={() => setIsModalOpen(true)}
            projectName={projectName}
            onProjectNameChange={setProjectName}
            taxRate={taxRate}
            onExport={handleExport}
            onImport={handleImport}
            categoryBreakdown={categoryBreakdown}
          />
          <p className="text-sm text-muted-foreground mt-2 text-center hidden sm:block">
            Press{" "}
            <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded">
              ⌘K
            </kbd>{" "}
            for command palette or{" "}
            <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded">
              ⌘D
            </kbd>{" "}
            to quickly add items
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-border p-6">
          <div className="mb-6 flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === "All" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory("All")}
            >
              All
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
            {categories.length === 0 && (
              <span className="text-sm text-muted-foreground">
                No categories yet.{" "}
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => setIsCategoryManagerOpen(true)}
                >
                  Add one
                </button>
              </span>
            )}
          </div>

          {filteredItems.length > 0 && (
            <div className="md:hidden flex items-center gap-2 mb-4">
              <Checkbox
                checked={allIncludedState}
                onCheckedChange={toggleAllIncluded}
                aria-label="Select all items"
              />
              <span className="text-sm text-muted-foreground">Include all</span>
            </div>
          )}

          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No items yet. Press{" "}
              <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded">
                ⌘D
              </kbd>{" "}
              to add your first piece of equipment!
            </div>
          ) : (
            <div className="space-y-2">
              {/* Desktop Table Header */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 pb-2 border-b border-border text-sm font-medium text-muted-foreground">
                <div className="col-span-1">
                  <Checkbox
                    checked={allIncludedState}
                    onCheckedChange={toggleAllIncluded}
                    aria-label="Select all items"
                  />
                </div>
                <button className="col-span-4 flex items-center gap-1 hover:text-foreground transition-colors text-left" onClick={() => handleSort("name")}>
                  Item
                  {sortColumn === "name" ? (sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3 opacity-0 group-hover:opacity-100" />}
                </button>
                <button className="col-span-2 flex items-center gap-1 hover:text-foreground transition-colors text-left" onClick={() => handleSort("category")}>
                  Category
                  {sortColumn === "category" ? (sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3 opacity-0 group-hover:opacity-100" />}
                </button>
                <button className="col-span-2 flex items-center gap-1 hover:text-foreground transition-colors text-left" onClick={() => handleSort("price")}>
                  Price
                  {sortColumn === "price" ? (sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3 opacity-0 group-hover:opacity-100" />}
                </button>
                <button className="col-span-2 flex items-center gap-1 hover:text-foreground transition-colors text-left" onClick={() => handleSort("priceTax")}>
                  Price + Tax
                  {sortColumn === "priceTax" ? (sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3 opacity-0 group-hover:opacity-100" />}
                </button>
                <div className="col-span-1 text-right">Actions</div>
              </div>
              {sortedItems.map((item) => (
                <EquipmentItem
                  key={item.id}
                  item={item}
                  onToggle={toggleIncluded}
                  onDelete={deleteItem}
                  onUpdate={updateItem}
                  onEdit={handleEditItem}
                  categories={categories}
                  taxRate={taxRate}
                />
              ))}
              {items.length > 0 && (
                <div className="px-4 pt-4 border-t border-border">
                  {/* Mobile Total */}
                  <div className="md:hidden flex items-center justify-between">
                    <span className="text-lg font-semibold text-muted-foreground">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${totalCost.toFixed(2)}
                    </span>
                  </div>
                  {/* Desktop Total */}
                  <div className="hidden md:grid grid-cols-12 gap-4">
                    <div className="col-span-7"></div>
                    <div className="col-span-2"></div>
                    <div className="col-span-2">
                      <span className="text-2xl font-bold text-blue-600">
                        ${totalCost.toFixed(2)}
                      </span>
                    </div>
                    <div className="col-span-1"></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <AddItemDialog
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          categories={categories}
          onAdd={addItem}
          editItem={editingItemId ? items.find((item) => item.id === editingItemId) : undefined}
          onUpdate={updateItem}
          taxRate={taxRate}
        />

        <BudgetDialog
          isOpen={isBudgetModalOpen}
          onClose={() => setIsBudgetModalOpen(false)}
          currentBudget={budget}
          onSave={setBudget}
          taxRate={taxRate}
          onTaxRateChange={setTaxRate}
        />

        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onAddItem={() => setIsModalOpen(true)}
          onEditBudget={() => setIsBudgetModalOpen(true)}
          onEditItem={handleEditItem}
          onSelectCategory={setSelectedCategory}
          onManageCategories={() => setIsCategoryManagerOpen(true)}
          onExport={handleExport}
          onImport={handleImport}
          items={items}
          categories={["All", ...categories]}
          currentCategory={selectedCategory}
        />

        <CategoryManager
          isOpen={isCategoryManagerOpen}
          onClose={() => setIsCategoryManagerOpen(false)}
          categories={categories}
          onAddCategory={(category) => setCategories((prev) => [...prev, category])}
          onDeleteCategory={(category) =>
            setCategories((prev) => prev.filter((c) => c !== category))
          }
          itemCategories={items.map((item) => item.category)}
        />
      </div>
    </div>
  )
}
