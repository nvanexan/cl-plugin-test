import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { BudgetDialog } from "./BudgetDialog";

const meta = {
  title: "Features/BudgetDialog",
  component: BudgetDialog,
  tags: ["autodocs"],
  args: {
    onClose: fn(),
    onSave: fn(),
    onTaxRateChange: fn(),
  },
} satisfies Meta<typeof BudgetDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    currentBudget: 5000,
    taxRate: 13,
  },
};

export const NoBudgetSet: Story = {
  args: {
    isOpen: true,
    currentBudget: 0,
    taxRate: 13,
  },
};

export const CustomTaxRate: Story = {
  args: {
    isOpen: true,
    currentBudget: 10000,
    taxRate: 8.5,
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    currentBudget: 5000,
    taxRate: 13,
  },
};
