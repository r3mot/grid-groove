import { Monitor } from 'lucide-react'
import { COLORS } from '@/lib/color'

const PATTERN = [
  [1, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 1, 0],
  [1, 0, 1, 1, 1, 0, 1, 1],
  [0, 1, 0, 0, 0, 1, 0, 1],
]

export function RotateScreenPrompt() {
  return (
    <div className='fixed inset-0 landscape:hidden lg:hidden z-50 bg-background flex-col-center px-8 text-center'>
      <div className='flex-col-center gap-10 max-w-xs'>
        <div className='size-44 flex-center' aria-hidden>
          <div className='w-24 h-40 rounded-2xl border-2 border-border bg-card p-2.5 motion-safe:animate-rotate-device'>
            <div className='size-full rounded-lg bg-background p-1.5 grid grid-rows-4 gap-1'>
              {PATTERN.map((row, rowIndex) => (
                <div key={rowIndex} className='grid grid-cols-8 gap-0.5'>
                  {row.map((active, stepIndex) => (
                    <div
                      key={stepIndex}
                      className='rounded-[2px]'
                      style={{
                        backgroundColor: active
                          ? COLORS[rowIndex * 2]
                          : 'hsl(var(--muted))',
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='space-y-2'>
          <h2 className='text-xl font-semibold tracking-tight text-foreground'>
            Turn your phone sideways
          </h2>
          <p className='text-sm text-muted-foreground'>
            Grid Groovin needs a little more room. Rotate to landscape to start
            making beats.
          </p>
        </div>

        <div className='flex items-center gap-3 rounded-lg border bg-card/50 px-4 py-3 text-left'>
          <Monitor className='size-4 shrink-0 text-muted-foreground' />
          <p className='text-xs text-muted-foreground'>
            The full studio, with mixer, effects and keyboard, is available on
            desktop.
          </p>
        </div>
      </div>
    </div>
  )
}
