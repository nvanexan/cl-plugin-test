import { useEffect, useRef, useState } from "react"
import { DollarSign } from "lucide-react"
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

interface BudgetDialogProps {
  isOpen: boolean
  onClose: () => void
  currentBudget: number
  onSave: (budget: number) => void
  taxRate: number
  onTaxRateChange: (rate: number) => void
}

export function BudgetDialog({
  isOpen,
  onClose,
  currentBudget,
  onSave,
  taxRate,
  onTaxRateChange,
}: BudgetDialogProps) {
  const [budget, setBudget] = useState(currentBudget.toString())
  const [editedTaxRate, setEditedTaxRate] = useState(taxRate.toString())
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setBudget(currentBudget > 0 ? currentBudget.toString() : "")
      setEditedTaxRate(taxRate.toString())
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, currentBudget, taxRate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const budgetValue = parseFloat(budget) || 0
    const taxValue = parseFloat(editedTaxRate)
    onSave(budgetValue)
    if (!isNaN(taxValue) && taxValue >= 0) {
      onTaxRateChange(taxValue)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Set Budget
          </DialogTitle>
          <DialogDescription>
            Set your budget target and tax rate.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budget-input">Budget Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg pointer-events-none">$</span>
              <Input
                ref={inputRef}
                id="budget-input"
                type="number"
                step="0.01"
                min="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="0.00"
                className="text-lg"
                style={{ paddingLeft: "2rem", paddingTop: "0.75rem", paddingBottom: "0.75rem" }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tax-rate">Tax Rate (%)</Label>
            <div className="relative">
              <Input
                id="tax-rate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={editedTaxRate}
                onChange={(e) => setEditedTaxRate(e.target.value)}
                placeholder="13"
                style={{ paddingRight: "2rem" }}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">%</span>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Budget
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
