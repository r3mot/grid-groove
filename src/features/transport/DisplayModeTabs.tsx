import { useUIStore } from '@/stores/uiStore'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DisplayMode } from '@/types'

export function DisplayModeTabs() {
  const displayMode = useUIStore(state => state.displayMode)
  const setDisplayMode = useUIStore(state => state.setDisplayMode)

  function handleChange(mode: string) {
    setDisplayMode(mode as DisplayMode)
  }

  return (
    <div className='flex items-center gap-2 w-fit'>
      <Tabs defaultValue={displayMode} onValueChange={handleChange}>
        <TabsList>
          <TabsTrigger value='step'>Steps</TabsTrigger>
          <TabsTrigger value='velocity'>Velocity</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
