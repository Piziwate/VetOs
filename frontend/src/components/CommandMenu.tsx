import * as React from "react"
import { useNavigate } from "react-router-dom"
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Users,
  PawPrint,
  Plus,
  Search,
  Keyboard,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
      
      // Global navigation shortcuts
      if (!open) {
        if (e.key === "g") {
          const handleGo = (ev: KeyboardEvent) => {
            if (ev.key === "d") navigate("/");
            if (ev.key === "c") navigate("/clients");
            if (ev.key === "p") navigate("/patients");
            window.removeEventListener("keydown", handleGo);
          };
          window.addEventListener("keydown", handleGo, { once: true });
        }
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, navigate])

  return (
    <>
      <p className="text-sm text-muted-foreground hidden lg:block">
        Press{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => { navigate("/"); setOpen(false); }}>
              <User className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
              <CommandShortcut>G D</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => { navigate("/clients"); setOpen(false); }}>
              <Users className="mr-2 h-4 w-4" />
              <span>Clients</span>
              <CommandShortcut>G C</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => { navigate("/patients"); setOpen(false); }}>
              <PawPrint className="mr-2 h-4 w-4" />
              <span>Patients</span>
              <CommandShortcut>G P</CommandShortcut>
            </CommandItem>
          </nav>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => { /* Toggle Add Client Dialog somehow */ setOpen(false); }}>
              <Plus className="mr-2 h-4 w-4" />
              <span>New Client</span>
              <CommandShortcut>N C</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Settings">
            <CommandItem onSelect={() => { navigate("/settings"); setOpen(false); }}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
