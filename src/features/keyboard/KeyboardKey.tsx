import { cn } from '@/lib/utils'

interface KeyboardKeyProps {
  musicalNote: string
  mappedKey: string
  isKeyActive?: boolean
  leftPosition?: string
}

function LightKey({ musicalNote, mappedKey, isKeyActive }: KeyboardKeyProps) {
  const activeStyle = isKeyActive ? 'bg-stone-400' : 'shadow-md hover:shadow-lg'

  return (
    <button
      aria-pressed={isKeyActive}
      aria-label={`Light key for note ${musicalNote} mapped to ${mappedKey}`}
      className={cn(
        'flex-1 border-r last:border-r-0 rounded-b-md flex flex-col justify-end items-center pb-2',
        'bg-stone-100 text-foreground',
        'transition-all duration-200 ease-in-out',
        activeStyle,
      )}
    >
      <span className='text-xs font-semibold text-black'>{musicalNote}</span>
      <span className='text-xs text-black'>({mappedKey})</span>
    </button>
  )
}

function DarkKey({
  musicalNote,
  mappedKey,
  isKeyActive,
  leftPosition,
}: KeyboardKeyProps) {
  return (
    <button
      aria-pressed={isKeyActive}
      aria-label={`Dark key for note ${musicalNote} mapped to ${mappedKey}`}
      className={cn(
        'pointer-events-auto bg-black absolute w-[8%] h-3/5 rounded-b-md flex flex-col justify-end items-center pb-2 z-10 transition-all',
        isKeyActive && 'bg-stone-900',
      )}
      style={{ left: leftPosition }}
      onClick={() => console.log(`Black key ${mappedKey} clicked`)}
    >
      <span className='text-xs font-semibold text-white'>{musicalNote}</span>
      <span className='text-xs text-gray-400'>({mappedKey})</span>
    </button>
  )
}

export { LightKey, DarkKey }
