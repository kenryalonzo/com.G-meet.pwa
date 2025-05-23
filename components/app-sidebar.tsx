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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import { TbBrandTabler } from "react-icons/tb"
import { MdOutlineVideocam } from "react-icons/md"
import Link from "next/link"
import Logo from "./logo"
import { ChevronUp, LogOut, Popcorn } from "lucide-react"
import Image from "next/image"
import logout from "@/lib/logout"
import DeleteAccountModal from "@/features/user/components/delete-account-modal"

// This is sample data.
const items = [ 

    {
        label: "Join meeting",
        url: "/joinmeeting",
        icon: TbBrandTabler,
    },
    {
        label: "Dashboard",
        url: "/dashboard",
        icon: MdOutlineVideocam,
    },
]
    

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    const [open, setOpen] = React.useState(false)
  return (
    <>
        <Sidebar {...props}>
            <SidebarContent>
                <SidebarGroup>
                    <Logo />
                <SidebarGroupContent className="mt-4">
                    <SidebarMenu>
                        {items.map((item, index) => (
                        <SidebarMenuItem key={index}>
                            <SidebarMenuButton asChild size={"lg"}>
                            <Link href={item.url}>
                                <item.icon className="size-5 flex-shrink-0 text-neutral-700" />
                                <span>{item.label}</span>
                            </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        {/* <SidebarRail /> */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <SidebarMenuButton>
                            <Image
                            src={"/logo.svg"}
                            alt="logo"
                            width={50}
                            height={50}
                            className="rounded-full size-7 flex-shrink-0"
                            />
                            Username
                            <ChevronUp className="ml-auto" />
                        </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                        side="top"
                        className="w-[--radix-popper-anchor-width] z-[200]"
                        >
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={async () => {
                                await logout()
                            }}
                        >  
                            <LogOut className="size-4 mr-2" />
                            <span className="text-sm">Logout</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive cursor-pointer"
                            onClick={async () => {
                                setOpen(true)
                            }}
                        >  
                            <Popcorn className="size-4 mr-2 text-destructive" />
                            <span className="text-sm">Delete Account</span>
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
        {
            open &&
            <DeleteAccountModal
                open={open}
                setOpen={setOpen}
            />
        }
    </>
  )
}
