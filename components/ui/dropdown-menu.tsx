"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import dynamic from 'next/dynamic';
import { useTheme } from "next-themes"

// @ts-ignore
const CheckIcon: any = dynamic(() => import('lucide-react').then(mod => mod.Check), { ssr: false });
// @ts-ignore
const ChevronRightIcon: any = dynamic(() => import('lucide-react').then(mod => mod.ChevronRight), { ssr: false });
// @ts-ignore
const CircleIcon: any = dynamic(() => import('lucide-react').then(mod => mod.Circle), { ssr: false });

import { cn } from "@/lib/utils"

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  )
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  )
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Determine if we're in dark mode
  const isDark = mounted ? (resolvedTheme === 'dark' || theme === 'dark') : false

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          // Glassmorphic design with proper theme detection
          isDark ? "bg-[#1A1A1D]" : "bg-white/98",
          isDark ? "text-[#E4E4E7]" : "text-[#27272A]",
          "backdrop-blur-2xl backdrop-saturate-150",
          isDark ? "border-[#2A2A2D]/80" : "border-[#E4E4E7]/60",
          isDark ? "shadow-2xl shadow-black/80" : "shadow-2xl shadow-black/[0.12]",
          isDark ? "ring-1 ring-white/[0.12]" : "ring-1 ring-black/[0.05]",
          // Animations
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          "data-[side=top]:slide-in-from-bottom-2",
          // Layout
          "z-50 max-h-(--radix-dropdown-menu-content-available-height)",
          "min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin)",
          "overflow-x-hidden overflow-y-auto",
          "rounded-xl p-2",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted ? (resolvedTheme === 'dark' || theme === 'dark') : false

  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        // Modern glassmorphic hover effects with theme detection
        isDark ? "hover:bg-white/10 focus:bg-white/12" : "hover:bg-zinc-100/70 focus:bg-zinc-100/90",
        isDark ? "active:bg-white/15" : "active:bg-zinc-200/80",
        "transition-all duration-150 ease-out",
        isDark ? "hover:shadow-black/20" : "hover:shadow-sm",
        // Destructive variant
        "data-[variant=destructive]:text-red-600 dark:data-[variant=destructive]:text-red-400",
        "data-[variant=destructive]:hover:bg-red-500/15",
        "dark:data-[variant=destructive]:hover:bg-red-500/20",
        "data-[variant=destructive]:focus:bg-red-500/20",
        "data-[variant=destructive]:*:[svg]:!text-red-600",
        "dark:data-[variant=destructive]:*:[svg]:!text-red-400",
        // Icon styling
        "[&_svg:not([class*='text-'])]:text-muted-foreground",
        // Layout
        "relative flex cursor-default items-center gap-2",
        "rounded-lg px-2 py-1.5 text-sm font-medium",
        "outline-hidden select-none",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "data-[inset]:pl-8",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        // Modern glassmorphic hover effects
        "focus:bg-gray-100/70 dark:focus:bg-white/12 focus:text-foreground",
        "hover:bg-gray-100/50 dark:hover:bg-white/10 hover:text-foreground",
        "active:bg-gray-200/70 dark:active:bg-white/15",
        "transition-all duration-150 ease-out",
        "hover:shadow-sm dark:hover:shadow-black/20",
        // Layout
        "relative flex cursor-default items-center gap-2",
        "rounded-lg py-1.5 pr-2 pl-8 text-sm font-medium",
        "outline-hidden select-none",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        // Modern glassmorphic hover effects
        "focus:bg-gray-100/70 dark:focus:bg-white/12 focus:text-foreground",
        "hover:bg-gray-100/50 dark:hover:bg-white/10 hover:text-foreground",
        "active:bg-gray-200/70 dark:active:bg-white/15",
        "transition-all duration-150 ease-out",
        "hover:shadow-sm dark:hover:shadow-black/20",
        // Layout
        "relative flex cursor-default items-center gap-2",
        "rounded-lg py-1.5 pr-2 pl-8 text-sm font-medium",
        "outline-hidden select-none",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        // Modern glassmorphic hover effects
        "focus:bg-gray-100/70 dark:focus:bg-white/12 focus:text-foreground",
        "hover:bg-gray-100/50 dark:hover:bg-white/10 hover:text-foreground",
        "data-[state=open]:bg-gray-100/70 dark:data-[state=open]:bg-white/12",
        "data-[state=open]:text-foreground",
        "active:bg-gray-200/70 dark:active:bg-white/15",
        "transition-all duration-150 ease-out",
        "hover:shadow-sm dark:hover:shadow-black/20",
        // Layout
        "flex cursor-default items-center rounded-lg px-2 py-1.5 text-sm font-medium",
        "outline-hidden select-none data-[inset]:pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted ? (resolvedTheme === 'dark' || theme === 'dark') : false

  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        // Glassmorphic design with proper theme detection
        isDark ? "bg-[#1A1A1D]" : "bg-white/98",
        isDark ? "text-[#E4E4E7]" : "text-[#27272A]",
        "backdrop-blur-2xl backdrop-saturate-150",
        isDark ? "border-[#2A2A2D]/80" : "border-[#E4E4E7]/60",
        isDark ? "shadow-2xl shadow-black/80" : "shadow-2xl shadow-black/[0.12]",
        isDark ? "ring-1 ring-white/[0.12]" : "ring-1 ring-black/[0.05]",
        // Animations
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2",
        // Layout
        "z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin)",
        "overflow-hidden rounded-xl p-2",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
