import RoomProvider from '@/features/room/provider/room-provider'
import CurrentUser from '@/lib/auth'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'

interface Props {
    children: ReactNode
}

const Layout = async ({ children }: Props) => {
    const user = await CurrentUser()
    if (!user || !user.id || !user.image || !user.name) return redirect('/')
        
    return (
        <RoomProvider user={{ id: user.id, name: user.name, image: user.image }}>
            {children}
        </RoomProvider>
    )
}

export default Layout