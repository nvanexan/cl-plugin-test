import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { AddItemDialog } from "./AddItemDialog";
import { mockItems, mockCategories } from "./__mocks__/data";

const meta = {
  title: "Features/AddItemDialog",
  component: AddItemDialog,
  tags: ["autodocs"],
  args: {
    onClose: fn(),
    onAdd: fn(),
    onUpdate: fn(),
    categories: mockCategories,
    taxRate: 13,
  },
} satisfies Meta<typeof AddItemDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AddMode: Story = {
  args: {
    isOpen: true,
  },
};

export const EditMode: Story = {
  args: {
    isOpen: true,
    editItem: mockItems[0],
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
  },
};
