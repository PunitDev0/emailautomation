import { Diamond, Layers, Palette, Minimize, Moon } from "lucide-react";

export const TEMPLATE_STYLES = [
  {
    id: "glassmorphism",
    name: "Glassmorphism",
    description: "Modern glass effect design",
    icon: Diamond,
    preview: "bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg border border-white/20",
  },
  {
    id: "neumorphism",
    name: "Neumorphism",
    description: "Soft 3D design style",
    icon: Layers,
    preview: "bg-gray-100 shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff]",
  },
  {
    id: "gradient",
    name: "Gradient",
    description: "Vibrant gradient backgrounds",
    icon: Palette,
    preview: "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple design",
    icon: Minimize,
    preview: "bg-white border border-gray-200",
  },
  {
    id: "dark",
    name: "Dark Mode",
    description: "Modern dark theme",
    icon: Moon,
    preview: "bg-gray-900 text-white",
  },
];