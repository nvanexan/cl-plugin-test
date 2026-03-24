import { useState, useRef, useEffect } from "react"
import { DollarSign, TrendingUp, TrendingDown, Plus, Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const CATEGORY_COLORS = [
  { bg: "bg-blue-500", text: "bg-blue-500" },
  { bg: "bg-emerald-500", text: "bg-emerald-500" },
  { bg: "bg-amber-500", text: "bg-amber-500" },
  { bg: "bg-violet-500", text: "bg-violet-500" },
  { bg: "bg-rose-500", text: "bg-rose-500" },
  { bg: "bg-cyan-500", text: "bg-cyan-500" },
  { bg: "bg-orange-500", text: "bg-orange-500" },
  { bg: "bg-pink-500", text: "bg-pink-500" },
  { bg: "bg-teal-500", text: "bg-teal-500" },
  { bg: "bg-indigo-500", text: "bg-indigo-500" },
]

interface BudgetTrackerProps {
  budget: number
  totalCost: number
  onEditBudget: () => void
  onAddEquipment: () => void
  projectName: string
  onProjectNameChange: (name: string) => void
  taxRate: number
  onExport: () => void
  onImport: () => void
  categoryBreakdown: Record<string, number>
}

export function BudgetTracker({
  budget,
  totalCost,
  onEditBudget,
  onAddEquipment,
  projectName,
  onProjectNameChange,
  onExport,
  onImport,
  categoryBreakdown,
}: BudgetTrackerProps) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState(projectName)
  const inputRef = useRef<HTMLInputElement>(null)

  const difference = budget - totalCost
  const isOverBudget = difference < 0
  const percentageUsed = budget > 0 ? (totalCost / budget) * 100 : 0

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditingName])

  useEffect(() => {
    setEditedName(projectName)
  }, [projectName])

  const handleSaveName = () => {
    const trimmedName = editedName.trim()
    if (trimmedName) {
      onProjectNameChange(trimmedName)
    } else {
      setEditedName(projectName)
    }
    setIsEditingName(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveName()
    } else if (e.key === "Escape") {
      setEditedName(projectName)
      setIsEditingName(false)
    }
  }

  return (
    <Card className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-foreground" />
          {isEditingName ? (
            <Input
              ref={inputRef}
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={handleKeyDown}
              className="w-auto min-w-[200px] text-xl font-semibold"
              placeholder="Project Name"
            />
          ) : (
            <h2
              className="text-xl font-semibold cursor-pointer hover:text-primary transition-colors px-1"
              onClick={() => setIsEditingName(true)}
              title="Click to edit project name"
            >
              {projectName}
            </h2>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="icon" onClick={onExport} title="Export data">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onImport} title="Import data">
            <Upload className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={onEditBudget}>
            Set Budget
          </Button>
          <Button onClick={onAddEquipment} className="gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Equipment</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {budget === 0 ? (
        <button
          onClick={onEditBudget}
          className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
        >
          Click to set a budget
        </button>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-3 self-center">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Cost</span>
              <span className="font-medium">${totalCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Budget</span>
              <span className="font-medium">${budget.toFixed(2)}</span>
            </div>
          </div>

          <div
            className={`p-4 rounded-lg ${
              isOverBudget
                ? "bg-red-50 border border-red-200"
                : "bg-green-50 border border-green-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {isOverBudget ? (
                <TrendingUp className="w-5 h-5 text-red-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-green-600" />
              )}
              <span
                className={`font-medium whitespace-nowrap ${
                  isOverBudget ? "text-red-900" : "text-green-900"
                }`}
              >
                {isOverBudget ? "Over Budget" : "Under Budget"}
              </span>
            </div>
            <div
              className={`text-2xl font-bold ${
                isOverBudget ? "text-red-600" : "text-green-600"
              }`}
            >
              ${Math.abs(difference).toFixed(2)}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground">Budget Used</span>
              <span className="text-xs text-muted-foreground">
                {percentageUsed.toFixed(1)}%
              </span>
            </div>
            <Progress
              value={Math.min(percentageUsed, 100)}
              className={
                isOverBudget
                  ? "[&>div]:bg-red-500"
                  : percentageUsed > 80
                  ? "[&>div]:bg-yellow-500"
                  : "[&>div]:bg-green-500"
              }
            />
          </div>

          {Object.keys(categoryBreakdown).length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">By Category</span>
              </div>
              <TooltipProvider>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/20">
                  {(() => {
                    const entries = Object.entries(categoryBreakdown).sort(
                      ([, a], [, b]) => b - a
                    )
                    let offset = 0
                    return entries.map(([category, amount], index) => {
                      const width = (amount / budget) * 100
                      const clampedWidth = Math.min(width, 100 - offset)
                      const left = offset
                      offset += clampedWidth
                      const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length]
                      return (
                        <Tooltip key={category}>
                          <TooltipTrigger asChild>
                            <div
                              className={`absolute top-0 h-full ${color.bg} transition-all`}
                              style={{ left: `${left}%`, width: `${clampedWidth}%` }}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="bottom" sideOffset={4}>
                            {category}: ${amount.toFixed(2)} ({((amount / budget) * 100).toFixed(1)}%)
                          </TooltipContent>
                        </Tooltip>
                      )
                    })
                  })()}
                </div>
              </TooltipProvider>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                {Object.entries(categoryBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, amount], index) => (
                    <div key={category} className="flex items-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[index % CATEGORY_COLORS.length].bg}`}
                      />
                      <span className="text-[10px] text-muted-foreground">
                        {category} (${amount.toFixed(0)})
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
