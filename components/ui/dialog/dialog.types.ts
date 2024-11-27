// components/ui/dialog/dialog.types.ts

export interface DialogProps {
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface DialogHeaderProps {
  children: React.ReactNode
  className?: string
}

export interface DialogFooterProps {
  children: React.ReactNode
  className?: string
}

export interface DialogContentProps {
  children: React.ReactNode
  className?: string
}