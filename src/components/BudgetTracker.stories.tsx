import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { BudgetTracker } from "./BudgetTracker";
import { mockCategoryBreakdown } from "./__mocks__/data";

const meta = {
  title: "Features/BudgetTracker",
  component: BudgetTracker,
  tags: ["autodocs"],
  args: {
    onEditBudget: fn(),
    onAddEquipment: fn(),
    onProjectNameChange: fn(),
    onExport: fn(),
    onImport: fn(),
  },
} satisfies Meta<typeof BudgetTracker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    budget: 5000,
    totalCost: 637.65,
    projectName: "Studio Setup",
    taxRate: 13,
    categoryBreakdown: mockCategoryBreakdown,
  },
};

export const NoBudgetSet: Story = {
  args: {
    budget: 0,
    totalCost: 0,
    projectName: "New Project",
    taxRate: 13,
    categoryBreakdown: {},
  },
};

export const OverBudget: Story = {
  args: {
    budget: 500,
    totalCost: 637.65,
    projectName: "Tight Budget Project",
    taxRate: 13,
    categoryBreakdown: mockCategoryBreakdown,
  },
};

export const NearBudget: Story = {
  args: {
    budget: 700,
    totalCost: 637.65,
    projectName: "Almost There",
    taxRate: 13,
    categoryBreakdown: mockCategoryBreakdown,
  },
};

export const EmptyCategories: Story = {
  args: {
    budget: 5000,
    totalCost: 150,
    projectName: "Simple Project",
    taxRate: 13,
    categoryBreakdown: {},
  },
};
