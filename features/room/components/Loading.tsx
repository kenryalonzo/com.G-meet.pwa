import { motion } from 'motion/react'
import { Loader2 } from 'lucide-react'

interface Props {
  title: string
  subtitle?: string
}

const Loading = ({ title, subtitle = "Setting up your camera, mic and connection." }: Props) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-background px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-sm w-full text-center">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-primary/10">
          <Loader2 className="text-primary size-6 animate-spin" />
        </div>
        <h1 className="text-xl font-medium mb-2">{title}</h1>
        <p className="text-muted-foreground text-sm">{subtitle}</p>
      </div>
    </motion.div>
  )
}

export default Loading
