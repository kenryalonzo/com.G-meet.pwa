import { Button } from '@/components/ui/button'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'motion/react'

const domain = process.env.NEXT_PUBLIC_BASE_URL

const Unauthorized = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className='flex items-center justify-center min-h-screen bg-background px-4'
    >
      <div className='max-w-md w-full flex flex-col items-center text-center bg-card rounded-2xl shadow-xl p-8 border border-border'>
        <div className='mb-6 bg-destructive/10 p-3 rounded-full'>
          <AlertTriangle className='size-8 text-destructive' />
        </div>

        <h1 className='text-2xl font-semibold mb-3'>
          Meeting not found
        </h1>

        <p className='text-muted-foreground mb-6'>
          Double check the meeting code in the link you were given.
        </p>

        <div className='p-3 rounded-lg bg-muted mb-6 w-full'>
          <p className='text-sm font-mono text-muted-foreground'>
            {domain}/xxx-yyyy-zzz
          </p>
        </div>

        <Button asChild variant={"outline"}>
          <Link href={'/'} className='inline-flex items-center'>
            <ArrowLeft className='size-4 mr-2' />
            Return home
          </Link>
        </Button>
      </div>
    </motion.div>
  )
}

export default Unauthorized
