"use client"

import * as React from "react"
import TextareaAutosize from "react-textarea-autosize"
import type { TextareaAutosizeProps } from 'react-textarea-autosize';

import { cn } from "@/lib/utils"

export type TextareaProps = React.ComponentProps<typeof TextareaAutosize>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextareaAutosize
        className={cn(
          "flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "min-h-[80px]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
