import { Music2, RotateCw } from 'lucide-react'

export function RotateScreenPrompt() {
  return (
    <div className='fixed inset-0 landscape:hidden lg:hidden bg-zinc-950 z-50 flex flex-col items-center justify-center p-6 text-center'>
      <div className='absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,255,109,0.05)_50%,transparent_75%,transparent_100%)] animate-pulse' />
      <div className='relative space-y-6'>
        <div className='flex flex-col items-center gap-2'>
          <Music2 className='w-16 h-16 text-emerald-400' />
          <h2 className='text-2xl font-bold text-zinc-100'>
            Desktop Experience Recommended
          </h2>
          <p className='text-zinc-400 max-w-sm'>
            GridGroovin works best on desktop for precise control and full
            features
          </p>
        </div>
        <div className='flex flex-col items-center gap-4 py-6 px-4 rounded-lg bg-zinc-900/50'>
          <div className='space-y-2'>
            <p className='text-zinc-300 flex items-center justify-center gap-2'>
              <RotateCw className='w-5 h-5 animate-spin' />
              Rotate for minimal mobile version
            </p>
            <p className='text-zinc-500 text-sm'>
              Limited features available in portrait mode
            </p>
          </div>
        </div>
      </div>
      <div className='absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-emerald-400/5 to-transparent' />
      <div className='absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-emerald-400/5 to-transparent' />
    </div>
  )
}
