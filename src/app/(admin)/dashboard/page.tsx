'use client'

import { useQuery } from '@tanstack/react-query'

export default function Page() {
  const { data: sessionData } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const response = await fetch('/api/db/users')
      return response.json()
    },
  })

  return (
    <div className="container max-w-screen-sm space-y-12">
      <div className="space-y-1 border-b pb-4">
        <h1 className="text-2xl font-medium">Dashboard</h1>
        <p className="text-primary/50">
          Welcome back! Here&apos;s a quick overview of your account!
        </p>
      </div>
    </div>
  )
}
