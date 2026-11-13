import { Loader2 } from 'lucide-react'

const Loading = () => {
  return (
    <div className='fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center'>
      <Loader2 className="size-8 text-primary animate-spin" />
    </div>
  )
}

export default Loading
