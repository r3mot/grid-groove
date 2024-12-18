import { cn } from '@/lib/utils'

interface InsetBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function InsetBorder({ className, ...props }: InsetBorderProps) {
  return (
    <div
      className={cn(
        className,
        'shadow-[inset_0px_3px_6px_0px_rgba(0,_0,_0,_0.7)]',
        'cursor-row-resize bg-background/90 border rounded-md select-none overflow-hidden',
        'inline-flex items-center',
      )}
      {...props}
    />
  )
}
