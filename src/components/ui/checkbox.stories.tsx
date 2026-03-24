import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: {
    onCheckedChange: fn(),
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox {...args} id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

export const Indeterminate: Story = {
  args: {
    checked: "indeterminate",
  },
};

export const IndeterminateWithLabel: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox {...args} id="select-all" checked="indeterminate" />
      <Label htmlFor="select-all">Select all items</Label>
    </div>
  ),
};

export const Multiple: Story = {
  render: (args) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Checkbox {...args} id="taxable" defaultChecked />
        <Label htmlFor="taxable">Taxable</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox {...args} id="excluded" />
        <Label htmlFor="excluded">Excluded from budget</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox {...args} id="archived" disabled />
        <Label htmlFor="archived">Archived</Label>
      </div>
    </div>
  ),
};
