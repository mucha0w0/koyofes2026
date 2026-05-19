import {
  Ghost,
  Coffee,
  Music,
  Utensils,
  Camera,
  Theater,
  Palette,
  Sword,
  LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Ghost,
  Coffee,
  Music,
  Utensils,
  Camera,
  Theater,
  Palette,
  Sword,
}

export function getLucideIcon(iconName: string): LucideIcon | null {
  return iconMap[iconName] || null
}
