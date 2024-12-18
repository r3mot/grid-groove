import { useState, useRef } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertTriangle } from 'lucide-react'

interface WarningDialogProps {
  title: string
  description: string
  checkboxLabel?: string
  onConfirm: (dontAskAgain: boolean) => void
  open: boolean
  onClose: () => void
  confirmButtonText?: string
  cancelButtonText?: string
}

export function WarningDialog({
  title,
  description,
  checkboxLabel = "Don't ask me again",
  onConfirm,
  open,
  onClose,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
}: WarningDialogProps) {
  const [dontAskAgain, setDontAskAgain] = useState(false)
  const dontAskAgainRef = useRef<HTMLButtonElement>(null)

  const handleConfirm = async () => {
    onConfirm(dontAskAgain)
    onClose()
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-center gap-2'>
            <AlertTriangle className='w-5 h-5 text-yellow-500' />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className='text-sm text-muted-foreground'>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='grid grid-cols-2'>
          <div className='flex items-center space-x-2 ml-full w-fit'>
            <Checkbox
              id='dontAskAgain'
              checked={dontAskAgain}
              onCheckedChange={checked => setDontAskAgain(checked as boolean)}
            />
            <label
              htmlFor='dontAskAgain'
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              {checkboxLabel}
            </label>
          </div>
          <div className='flex space-x-2 x-fit'>
            <AlertDialogCancel asChild>
              <Button variant='outline'>{cancelButtonText}</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={handleConfirm}
                ref={dontAskAgainRef}
                className='text-white bg-red-500'
              >
                {confirmButtonText}
              </Button>
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
