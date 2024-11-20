import * as React from "react"
import type { ToastProps, ToastActionElement } from "./toast"

export type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

export interface State {
  toasts: ToasterToast[]
}