"use client"

import * as React from "react"

interface TabsProps {
  defaultValue?: string
  children: React.ReactNode
  onValueChange?: (value: string) => void
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps & React.HTMLAttributes<HTMLDivElement>>(
  ({ defaultValue, children, onValueChange, ...props }, ref) => {
    const [activeTab, setActiveTab] = React.useState(defaultValue || "")

    React.useEffect(() => {
      if (defaultValue && !activeTab) {
        setActiveTab(defaultValue)
      }
    }, [defaultValue, activeTab])

    const handleValueChange = (value: string) => {
      setActiveTab(value)
      onValueChange?.(value)
    }

    return (
      <div ref={ref} {...props}>
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child as any, { activeTab, onValueChange: handleValueChange })
            : child,
        )}
      </div>
    )
  },
)
Tabs.displayName = "Tabs"

interface TabsListProps {
  children: React.ReactNode
  activeTab?: string
  onValueChange?: (value: string) => void
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps & React.HTMLAttributes<HTMLDivElement>>(
  ({ children, activeTab, onValueChange, className, ...props }, ref) => (
    <div
      ref={ref}
      className={`inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground ${className || ""}`}
      {...props}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child as any, { activeTab, onValueChange }) : child,
      )}
    </div>
  ),
)
TabsList.displayName = "TabsList"

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  activeTab?: string
  onValueChange?: (value: string) => void
}

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  TabsTriggerProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ value, children, activeTab, onValueChange, className, ...props }, ref) => (
  <button
    ref={ref}
    onClick={() => onValueChange?.(value)}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
      activeTab === value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
    } ${className || ""}`}
    {...props}
  >
    {children}
  </button>
))
TabsTrigger.displayName = "TabsTrigger"

interface TabsContentProps {
  value: string
  children: React.ReactNode
  activeTab?: string
  onValueChange?: (value: string) => void
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps & React.HTMLAttributes<HTMLDivElement>>(
  ({ value, children, activeTab, onValueChange, className, ...props }, ref) => (
    <div
      ref={ref}
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        activeTab === value ? "" : "hidden"
      } ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  ),
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
