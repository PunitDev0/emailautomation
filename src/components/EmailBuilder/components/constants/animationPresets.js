import { Eye, TrendingUp, ChevronDown, ChevronRight, Play, Heart, Zap, RotateCcw, Maximize } from "lucide-react";

export const ANIMATION_PRESETS = [
  { id: "fadeIn", name: "Fade In", icon: Eye },
  { id: "slideUp", name: "Slide Up", icon: TrendingUp },
  { id: "slideDown", name: "Slide Down", icon: ChevronDown },
  { id: "slideLeft", name: "Slide Left", icon: ChevronRight },
  { id: "slideRight", name: "Slide Right", icon: ChevronRight },
  { id: "bounce", name: "Bounce", icon: Play },
  { id: "pulse", name: "Pulse", icon: Heart },
  { id: "shake", name: "Shake", icon: Zap },
  { id: "rotate", name: "Rotate", icon: RotateCcw },
  { id: "scale", name: "Scale", icon: Maximize },
];