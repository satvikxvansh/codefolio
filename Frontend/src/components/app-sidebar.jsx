import { UserSearch, Swords, Home, Search, Settings, PanelLeftIcon } from "lucide-react"

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { SidebarProvider } from "./ui/sidebar"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: Home,
  },
  {
    title: "Friends",
    url: "#",
    icon: UserSearch,
  },
  {
    title: "Compare",
    url: "#",
    icon: Swords,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
]

export function AppSidebar() {
  const { toggleSidebar } = useSidebar()
  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="bg-[#09090b]">
        {/* Added profile here */}
      </SidebarHeader>
      <SidebarContent className="bg-[#09090b] text-zinc-200">
        <SidebarGroup>
          <SidebarGroupLabel className='text-zinc-500'>Application</SidebarGroupLabel>
          <SidebarGroupContent className="pl-2">
            <SidebarMenu className="">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="pl-4" asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-[#09090b] text-zinc-200">
        <SidebarMenu className="pl-2">
          <SidebarMenuItem>
            <SidebarMenuButton className="pl-3" onClick={toggleSidebar} asChild>
              <a className="cursor-pointer">
                <PanelLeftIcon />
                <span>Open Sidebar</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="pl-3" asChild>
              <a className="cursor-pointer">
                <Settings />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}


// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"

// export function AppSidebar() {
//   return (
//     <Sidebar>
//       <SidebarHeader className="p-4 font-semibold">
//         My App
//       </SidebarHeader>

//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel>Application</SidebarGroupLabel>

//           <SidebarMenu>
//             <SidebarMenuItem>Dashboard</SidebarMenuItem>
//             <SidebarMenuItem>Profile</SidebarMenuItem>
//             <SidebarMenuItem>Settings</SidebarMenuItem>
//           </SidebarMenu>
//         </SidebarGroup>
//       </SidebarContent>

//       <SidebarFooter className="p-4 text-sm">
//         © 2026
//       </SidebarFooter>
//     </Sidebar>
//   )
// }