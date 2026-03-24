import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { CategoryManager } from "./CategoryManager";
import { mockCategories } from "./__mocks__/data";

const meta = {
  title: "Features/CategoryManager",
  component: CategoryManager,
  tags: ["autodocs"],
  args: {
    onClose: fn(),
    onAddCategory: fn(),
    onDeleteCategory: fn(),
  },
} satisfies Meta<typeof CategoryManager>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    categories: mockCategories,
    itemCategories: ["Audio", "Video"],
  },
};

export const Empty: Story = {
  args: {
    isOpen: true,
    categories: [],
    itemCategories: [],
  },
};

export const AllInUse: Story = {
  args: {
    isOpen: true,
    categories: mockCategories,
    itemCategories: mockCategories,
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    categories: mockCategories,
    itemCategories: [],
  },
};
