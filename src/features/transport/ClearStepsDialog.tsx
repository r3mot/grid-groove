import { TrashCanIcon } from '@/components/icons/TrashCan'
import { toggleVariants } from '@/components/ui/toggle'
import { WarningDialog } from '@/components/WarningDialog'
import { usePatternStore } from '@/stores/patternStore'
import { useUIStore } from '@/stores/uiStore'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export function ClearStepsDialog() {
  const clearSteps = usePatternStore(state => state.clearSteps)
  const isWarningRead = useUIStore(state => state.isClearWarningRead)
  const setWarningRead = useUIStore(state => state.setClearWarningRead)

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  function handleClear() {
    if (!isWarningRead) {
      setIsDialogOpen(true)
      return
    } else {
      clearSteps()
    }
  }

  const handleConfirmation = async (dontAskAgain: boolean) => {
    if (dontAskAgain) {
      setWarningRead()
    }
    clearSteps()
  }

  return (
    <>
      <button
        onClick={handleClear}
        className={cn(toggleVariants({ variant: 'default' }))}
      >
        <TrashCanIcon />
        <span className='sr-only'>Clear all steps</span>
      </button>

      <WarningDialog
        title='Clear Sequencer'
        description='Are you sure you want to clear all steps? This action cannot be undone.'
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmation}
        confirmButtonText='Clear All Steps'
        cancelButtonText='Cancel'
      />
    </>
  )
}
