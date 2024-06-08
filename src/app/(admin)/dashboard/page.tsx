/* eslint-disable @next/next/no-img-element */
import { auth, signOut } from '@/lib/auth'
import { Pencil1Icon } from '@radix-ui/react-icons'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await auth()
  if (!session) return redirect('/access')

  return (
    <div className="container max-w-screen-sm space-y-12">
      <div className="space-y-1 border-b pb-4">
        <h1 className="text-2xl font-medium">Dashboard</h1>
        <p className="text-primary/50">
          Welcome back, {session.user.name.split(' ')[0]}
        </p>
      </div>
    </div>
  )
}
