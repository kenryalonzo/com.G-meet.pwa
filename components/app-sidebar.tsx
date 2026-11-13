import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutDashboard, Link2, Video, ChevronDown, LogOut, Trash2 } from "lucide-react"
import Link from "next/link"
import Logo from "./logo"
import { signOut } from "next-auth/react"
import DeleteAccountModal from "@/features/user/components/delete-account-modal"
import { cn, getInitials } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useCurrentUser from "@/hooks/use-current-user"

interface AppSidebarProps {
  isCollapsed?: boolean;
  isMobile?: boolean;
}

const NAV_ITEMS = [
  { label: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { label: "Join meeting", url: "/join-meeting", icon: Link2 },
  { label: "New meeting", url: "/dashboard", icon: Video },
];

export function AppSidebar({ isCollapsed = false, isMobile = false }: AppSidebarProps) {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()
  const [isProfileOpen, setIsProfileOpen] = React.useState(false)
  const user = useCurrentUser()

  React.useEffect(() => {
    setIsProfileOpen(false)
  }, [pathname])

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <>
      <Sidebar className={cn(
        "h-full border-r border-sidebar-border bg-sidebar transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        isMobile ? "fixed z-50 shadow-xl" : "relative"
      )}>
        <SidebarContent>
          <SidebarGroup>
            <div className={cn(
              "flex items-center px-4 py-5",
              isCollapsed ? "justify-center" : ""
            )}>
              <Logo compact={isCollapsed} />
            </div>

            <SidebarGroupContent className="mt-2">
              <SidebarMenu>
                {NAV_ITEMS.map((item, index) => {
                  const isActive = pathname === item.url
                  const Icon = item.icon

                  return (
                    <Tooltip key={index} delayDuration={0}>
                      <TooltipTrigger asChild>
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            asChild
                            size={isCollapsed ? "sm" : "lg"}
                            className={cn(
                              "transition-colors",
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-sidebar-accent"
                            )}
                          >
                            <Link
                              href={item.url}
                              className={cn(
                                "flex items-center",
                                isCollapsed ? "justify-center" : ""
                              )}
                            >
                              <Icon className={cn(
                                "flex-shrink-0",
                                isActive ? "text-primary" : "text-muted-foreground",
                                isCollapsed ? "size-5" : "size-5 mr-3"
                              )} />
                              {!isCollapsed && <span>{item.label}</span>}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </TooltipTrigger>
                      {isCollapsed && (
                        <TooltipContent side="right" className="ml-2">
                          {item.label}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className={cn(
          "border-t border-sidebar-border py-3",
          isCollapsed ? "px-0" : "px-4"
        )}>
          <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <DropdownMenuTrigger asChild>
              <div className={cn(
                "flex items-center rounded-lg p-2 cursor-pointer transition-colors",
                isProfileOpen ? "bg-sidebar-accent" : "hover:bg-sidebar-accent",
                isCollapsed ? "justify-center" : "justify-between"
              )}>
                <div className="flex items-center min-w-0">
                  <Avatar className="size-8 flex-shrink-0">
                    <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "You"} />
                    <AvatarFallback className="bg-primary/15 text-primary text-xs font-medium">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="ml-3 truncate">
                      <p className="text-sm font-medium truncate">{user?.name ?? "…"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                  )}
                </div>
                {!isCollapsed && (
                  <ChevronDown className={cn(
                    "ml-auto size-4 text-muted-foreground transition-transform",
                    isProfileOpen ? "rotate-180" : ""
                  )} />
                )}
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="top"
              className={cn("w-56", isCollapsed ? "ml-2" : "ml-0")}
              align={isCollapsed ? "start" : "end"}
            >
              <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                <LogOut className="size-4 mr-2" />
                <span>Log out</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-destructive cursor-pointer focus:text-destructive"
                onClick={() => setOpen(true)}
              >
                <Trash2 className="size-4 mr-2" />
                <span>Delete account</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      <DeleteAccountModal
        open={open}
        setOpen={setOpen}
      />
    </>
  )
}
