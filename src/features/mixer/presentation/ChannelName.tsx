export function ChannelName({ name }: { name: string }) {
  return (
    <div className='w-full py-1 mb-4 text-sm font-semibold text-center rounded-sm bg-background/60 text-muted-foreground'>
      <span className='capitalize'>{name}</span>
    </div>
  )
}
