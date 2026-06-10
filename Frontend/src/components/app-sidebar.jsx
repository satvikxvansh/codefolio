import { UserSearch, Swords, Home, Search, LogOut , PanelLeftIcon } from "lucide-react"
import { NavLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

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
    route: "/user/Dashboard",
    url: "#",
    icon: Home,
  },
  {
    title: "Friends",
    route: "/user/Friends",
    url: "#",
    icon: UserSearch,
  },
  {
    title: "Compare",
    route: "/user/Compare",
    url: "#",
    icon: Swords,
  },
  {
    title: "Search",
    route: "/user/Search",
    url: "#",
    icon: Search,
  },
]

export function AppSidebar() {

  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_API_KEY;


  const logout = async () => {
    await axios.post(`${BACKEND_URL}/logout`, {}, {
      withCredentials: true
    }).then(() => {
      console.log("logged out")
    }).catch(error => {
      console.log(error);
    })
    navigate("/login");
  }

  const { toggleSidebar } = useSidebar()
  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="bg-zinc-900">
        {/* Added profile here */}
      </SidebarHeader>
      <SidebarContent className="bg-zinc-900 text-zinc-200">
        <SidebarGroup>
          <SidebarGroupLabel className='text-zinc-500'>Application</SidebarGroupLabel>
          <SidebarGroupContent className="pl-2">
            <SidebarMenu className="">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="pl-4 hover:bg-emerald-500 transition-all " asChild>
                    <NavLink to={item.route}>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-zinc-900 text-zinc-200">
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
            <SidebarMenuButton className="pl-3 hover:bg-red-400 transition-all " asChild>
              <button className="cursor-pointer " onClick={logout}>
                <LogOut  />
                <span>Log Out</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
