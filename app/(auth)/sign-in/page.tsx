"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CircleAlert, Loader2 } from 'lucide-react'
import { GoogleIcon, GithubIcon } from '@/components/icons'
import { DEFAULT_REDIRECT } from '@/routes'
import Link from 'next/link'
import Logo from '@/components/logo'

const AuthPage = () => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || DEFAULT_REDIRECT
  const errorType = searchParams.get("error")

  const [pendingProvider, setPendingProvider] = useState<"google" | "github" | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (errorType === "OAuthAccountNotLinked") {
      setError("That email is already linked to a different sign-in method.")
    } else if (errorType) {
      setError("Something went wrong signing you in. Please try again.")
    }
  }, [errorType])

  const handleOAuthLogin = (provider: "google" | "github") => {
    setPendingProvider(provider)
    signIn(provider, { callbackUrl, redirect: true })
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <Card className="rounded-2xl border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
            <CardDescription>Sign in to start or join a call</CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 bg-destructive/10 p-3 rounded-lg flex items-center gap-2 text-sm text-destructive">
                <CircleAlert className="size-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full h-11 font-medium"
                onClick={() => handleOAuthLogin("google")}
                disabled={pendingProvider !== null}
              >
                {pendingProvider === "google" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <GoogleIcon className="size-4" />
                )}
                Continue with Google
              </Button>

              <Button
                variant="outline"
                className="w-full h-11 font-medium"
                onClick={() => handleOAuthLogin("github")}
                disabled={pendingProvider !== null}
              >
                {pendingProvider === "github" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <GithubIcon className="size-4" />
                )}
                Continue with GitHub
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing, you agree to Aperture&apos;s{' '}
          <Link href="/terms" className="underline hover:text-foreground">Terms</Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}

export default AuthPage
