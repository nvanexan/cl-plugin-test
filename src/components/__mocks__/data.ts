import type { Item } from "@/App";

export const mockItems: Item[] = [
  {
    id: "1",
    name: "Blue Yeti Microphone",
    category: "Audio",
    price: 129.99,
    link: "https://example.com/yeti",
    included: true,
    taxable: true,
  },
  {
    id: "2",
    name: "Studio Monitor Speakers",
    category: "Audio",
    price: 299.99,
    included: true,
    taxable: true,
  },
  {
    id: "3",
    name: "USB-C Hub",
    category: "Accessories",
    price: 49.99,
    included: true,
    taxable: false,
  },
  {
    id: "4",
    name: "Mechanical Keyboard",
    category: "Peripherals",
    price: 179.99,
    link: "https://example.com/keyboard",
    included: false,
    taxable: true,
  },
  {
    id: "5",
    name: "Webcam HD Pro",
    category: "Video",
    price: 89.99,
    included: true,
    taxable: true,
  },
];

export const mockCategories = ["Audio", "Video", "Accessories", "Peripherals"];

export const mockCategoryBreakdown: Record<string, number> = {
  Audio: 485.97,
  Accessories: 49.99,
  Video: 101.69,
};
