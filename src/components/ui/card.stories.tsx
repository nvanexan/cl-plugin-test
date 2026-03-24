import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description text goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content area.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Budget Summary</CardTitle>
        <CardDescription>Monthly spending overview</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">$1,250.00</p>
      </CardContent>
    </Card>
  ),
};

export const HeaderOnly: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Simple Card</CardTitle>
        <CardDescription>
          Header-only card with no content or footer.
        </CardDescription>
      </CardHeader>
    </Card>
  ),
};

export const FullExample: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Equipment Budget</CardTitle>
        <CardDescription>Track your gear purchases</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">
            ...
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Camera Body</span>
            <span className="font-medium">$2,499</span>
          </div>
          <div className="flex justify-between">
            <span>Lens</span>
            <span className="font-medium">$899</span>
          </div>
          <div className="flex justify-between">
            <span>Tripod</span>
            <span className="font-medium">$189</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <span className="text-muted-foreground text-sm">Total</span>
        <span className="font-bold">$3,587</span>
      </CardFooter>
    </Card>
  ),
};
