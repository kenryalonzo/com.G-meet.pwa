import { Search, X } from "lucide-react"
import { useRef, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { 
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchFormProps extends React.ComponentProps<"form"> {
  placeholder?: string
  onSearch?: (value: string) => void
  onClear?: () => void
  autoFocus?: boolean
  variant?: "default" | "minimal"
}

export function SearchForm({ 
  placeholder = "Search participants, messages, or files...",
  onSearch,
  onClear,
  autoFocus = true,
  variant = "default",
  className,
  ...props 
}: SearchFormProps) {
  const [value, setValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSearch?.(value)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    // Recherche en temps réel si onSearch est fourni
    if (onSearch && variant === "minimal") {
      onSearch(e.target.value)
    }
  }

  const handleClear = () => {
    setValue("")
    onClear?.()
    inputRef.current?.focus()
  }

  const isMinimal = variant === "minimal"

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn(
        "w-full", 
        isMinimal ? "" : "px-3",
        className
      )}
      {...props}
    >
      <SidebarGroup className={isMinimal ? "py-0" : "py-0 mb-2"}>
        <SidebarGroupContent className="relative group">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          
          <div className="relative">
            {isMinimal ? (
              <Input
                ref={inputRef}
                id="search"
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                autoFocus={autoFocus}
                className={cn(
                  "pl-10 pr-8 py-5 h-12",
                  isMinimal ? "border-0 focus:ring-0 shadow-none" : ""
                )}
              />
            ) : (
              <SidebarInput
                ref={inputRef}
                id="search"
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                autoFocus={autoFocus}
                className="pl-10 pr-8"
              />
            )}
            
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 select-none text-muted-foreground" />
            
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 size-6 rounded-full"
                onClick={handleClear}
                aria-label="Clear search"
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
      
      {!isMinimal && (
        <div className="px-2 mt-1 flex justify-end">
          <Button 
            type="submit" 
            size="sm" 
            variant="secondary"
            disabled={!value.trim()}
          >
            Search
          </Button>
        </div>
      )}
    </form>
  )
}