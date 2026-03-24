import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "Canon EOS R5",
  },
};

export const Number: Story = {
  args: {
    type: "number",
    placeholder: "0.00",
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="space-y-2">
      <Label htmlFor="item-name">Item Name</Label>
      <Input {...args} id="item-name" placeholder="e.g. Camera Body" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "Disabled input",
  },
};

export const FileInput: Story = {
  args: {
    type: "file",
  },
};

export const Invalid: Story = {
  render: (args) => (
    <div className="space-y-2">
      <Label htmlFor="required-field">Required Field</Label>
      <Input
        {...args}
        id="required-field"
        aria-invalid="true"
        placeholder="This field is required"
      />
    </div>
  ),
};
