"use client"

import * as React from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from "lucide-react"

interface ToolWrapperProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export default function ToolWrapper({ title, icon, children }: ToolWrapperProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <div className="flex items-center justify-between space-x-4 px-4 py-3 rounded-lg border bg-card text-card-foreground shadow-sm card-hover">
        <div className="flex items-center gap-3">
            {icon}
            <h4 className="text-lg font-semibold font-display">
                {title}
            </h4>
        </div>
        <CollapsibleTrigger asChild>
            <button className="rounded-sm p-1 text-muted-foreground transition-all hover:text-foreground data-[state=open]:rotate-180">
                <ChevronsUpDown className="h-5 w-5" />
                <span className="sr-only">Toggle</span>
            </button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
