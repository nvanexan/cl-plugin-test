import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { EquipmentItem } from "./EquipmentItem";
import { mockItems, mockCategories } from "./__mocks__/data";

const meta = {
  title: "Features/EquipmentItem",
  component: EquipmentItem,
  tags: ["autodocs"],
  args: {
    onToggle: fn(),
    onDelete: fn(),
    onUpdate: fn(),
    onEdit: fn(),
    categories: mockCategories,
    taxRate: 13,
  },
  decorators: [
    (Story) => (
      <div className="bg-white rounded-lg shadow-sm border border-border p-6 max-w-6xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EquipmentItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    item: mockItems[0],
  },
};

export const Excluded: Story = {
  args: {
    item: mockItems[3],
  },
};

export const NonTaxable: Story = {
  args: {
    item: mockItems[2],
  },
};

export const WithLink: Story = {
  args: {
    item: mockItems[0],
  },
};

export const WithoutLink: Story = {
  args: {
    item: mockItems[1],
  },
};

export const HighPrice: Story = {
  args: {
    item: {
      ...mockItems[1],
      name: "Professional Camera",
      price: 2499.99,
    },
  },
};
