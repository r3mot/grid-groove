import { cn } from '@/lib/utils'

interface ChannelStripProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function ChannelStrip({ className, ...props }: ChannelStripProps) {
  return (
    <div
      className={cn(
        'relative flex-col-center w-[4.5rem] p-2 shrink bg-secondary rounded-md',
        className,
      )}
    >
      {props.children}
    </div>
  )
}
