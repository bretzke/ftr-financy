import { cn } from '@/lib/utils'
import {
  getCategoryColorHex,
  getCategoryIcon,
} from '@/lib/category-options'

interface CategoryIconProps {
  icon: string
  color: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: { wrapper: 'size-8 rounded-md', icon: 'size-4' },
  md: { wrapper: 'size-10 rounded-lg', icon: 'size-5' },
  lg: { wrapper: 'size-12 rounded-lg', icon: 'size-6' },
} as const

export function CategoryIcon({
  icon,
  color,
  size = 'md',
  className,
}: CategoryIconProps) {
  const Icon = getCategoryIcon(icon)
  const hex = getCategoryColorHex(color)
  const sizes = sizeClasses[size]

  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center',
        sizes.wrapper,
        className
      )}
      style={{ backgroundColor: `${hex}1a`, color: hex }}
    >
      <Icon className={sizes.icon} />
    </span>
  )
}
