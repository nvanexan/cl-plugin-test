import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { CommandPalette } from "./CommandPalette";
import { mockItems, mockCategories } from "./__mocks__/data";

const meta = {
  title: "Features/CommandPalette",
  component: CommandPalette,
  tags: ["autodocs"],
  args: {
    onClose: fn(),
    onAddItem: fn(),
    onEditBudget: fn(),
    onEditItem: fn(),
    onSelectCategory: fn(),
    onManageCategories: fn(),
    onExport: fn(),
    onImport: fn(),
  },
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    items: mockItems,
    categories: mockCategories,
    currentCategory: "All",
  },
};

export const Empty: Story = {
  args: {
    isOpen: true,
    items: [],
    categories: [],
    currentCategory: "All",
  },
};

export const FilteredCategory: Story = {
  args: {
    isOpen: true,
    items: mockItems,
    categories: mockCategories,
    currentCategory: "Audio",
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    items: mockItems,
    categories: mockCategories,
    currentCategory: "All",
  },
};
