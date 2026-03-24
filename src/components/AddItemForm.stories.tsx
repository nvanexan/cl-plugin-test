import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { AddItemForm } from "./AddItemForm";
import { mockItems, mockCategories } from "./__mocks__/data";

const meta = {
  title: "Features/AddItemForm",
  component: AddItemForm,
  tags: ["autodocs"],
  args: {
    onAdd: fn(),
    onUpdate: fn(),
    categories: mockCategories,
    taxRate: 13,
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AddItemForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {},
};

export const WithEditItem: Story = {
  args: {
    editItem: mockItems[0],
  },
};

export const NoCategories: Story = {
  args: {
    categories: [],
  },
};
