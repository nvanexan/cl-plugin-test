import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const meta = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="camera">Camera</SelectItem>
        <SelectItem value="lens">Lens</SelectItem>
        <SelectItem value="lighting">Lighting</SelectItem>
        <SelectItem value="audio">Audio</SelectItem>
        <SelectItem value="accessories">Accessories</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="category">Category</Label>
      <Select>
        <SelectTrigger id="category" className="w-full">
          <SelectValue placeholder="Choose category..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="camera">Camera</SelectItem>
          <SelectItem value="lens">Lens</SelectItem>
          <SelectItem value="lighting">Lighting</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select equipment" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Camera Bodies</SelectLabel>
          <SelectItem value="r5">Canon EOS R5</SelectItem>
          <SelectItem value="a7iv">Sony A7 IV</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Lenses</SelectLabel>
          <SelectItem value="24-70">24-70mm f/2.8</SelectItem>
          <SelectItem value="70-200">70-200mm f/2.8</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const SmallSize: Story = {
  render: () => (
    <Select>
      <SelectTrigger size="sm" className="w-full">
        <SelectValue placeholder="Small trigger" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Option A</SelectItem>
        <SelectItem value="b">Option B</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Disabled select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Option A</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithDisabledItem: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="available">Available</SelectItem>
        <SelectItem value="unavailable" disabled>
          Unavailable
        </SelectItem>
        <SelectItem value="another">Another Option</SelectItem>
      </SelectContent>
    </Select>
  ),
};
