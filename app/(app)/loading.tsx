import { Loader } from 'lucide-react'
import React from 'react'

const loading = () => {
  return (
    <div className='w-full h-full flex justify-center items-center'>
        <Loader className="animate-spin size-12 text-muted-foreground rounded-full border-b-2 border-gray-900" />
    </div>
  )
}

export default loading