"use client"
import React, { useState, useEffect } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { formatPathname } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface Props {
  children: React.ReactNode
}

const Layout = ({ children } : Props) => {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [breadcrumbs, setBreadcrumbs] = useState<{ href: string; label: string }[]>([])

  // Détection mobile et gestion responsive
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Génération des breadcrumbs dynamiques
  useEffect(() => {
    if (!pathname) return
    
    const pathSegments = pathname
      .split('/')
      .filter(segment => segment)
      .map((segment, i, arr) => {
        const formatted = formatPathname(segment)
        return {
          href: '/' + arr.slice(0, i + 1).join('/'),
          label: Array.isArray(formatted) ? formatted.join(" ") : formatted
        }
      })
    
    // Ajout du breadcrumb "Home" seulement si on n'est pas sur la page d'accueil
    if (pathname !== '/') {
      setBreadcrumbs([
        { href: '/', label: 'Home' },
        ...pathSegments
      ])
    } else {
      setBreadcrumbs([])
    }
  }, [pathname])

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  return (
    <SidebarProvider>
      <div className={cn(
        "flex min-h-screen bg-background transition-all duration-300",
        isCollapsed ? "md:ml-16" : "md:ml-64"
      )}>
        <AppSidebar 
          isCollapsed={isCollapsed} 
          isMobile={isMobile}
        />
        
        <SidebarInset>
          <header className={cn(
            "sticky top-0 z-40 bg-background/80 backdrop-blur-sm h-16 flex items-center gap-2 border-b px-4 transition-all",
            isCollapsed ? "md:ml-16" : "md:ml-64"
          )}>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleSidebar}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden md:flex"
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </Button>
            
            <SidebarTrigger 
              className="md:hidden -ml-1" 
              aria-label="Toggle mobile sidebar"
            />
            
            <Separator orientation="vertical" className="h-6 mx-2" />
            
            <Breadcrumb className="overflow-x-auto whitespace-nowrap">
              <BreadcrumbList>
                {breadcrumbs.length > 0 ? (
                  breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.href}>
                      <BreadcrumbItem>
                        {index === breadcrumbs.length - 1 ? (
                          <BreadcrumbPage className="font-medium">
                            {crumb.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink 
                            href={crumb.href}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {index === 0 ? <Home size={16} className="inline mr-1" /> : null}
                            {crumb.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && (
                        <BreadcrumbSeparator />
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          
          <main className="flex-1 p-4 md:p-6">
            <React.Suspense fallback={
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-64 w-full" />
              </div>
            }>
              {children}
            </React.Suspense>
          </main>
          
          <footer className="py-4 px-6 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Aperture. All rights reserved.
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default Layout