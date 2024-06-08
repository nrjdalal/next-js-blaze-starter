/* eslint-disable @next/next/no-img-element */
import Provider from '@/app/(admin)/provider'
import Navbar from '@/components/navbar'
import Sidebar from '@/components/sidebar'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) return redirect('/access')

  return (
    <Provider>
      <div className="relative min-h-dvh bg-secondary/30">
        <Navbar />

        <Link
          href={'/account'}
          className="fixed right-16 top-2 size-10 lg:right-5"
        >
          <img
            className="size-10 rounded-full border"
            src={
              session.user.image
                ? session.user.image
                : 'https://api.dicebear.com/8.x/thumbs/svg?seed=Aneka'
            }
            alt=""
          />
        </Link>

        <div className="relative grid min-h-[calc(100dvh-3.5rem)] lg:grid-cols-[18rem_auto]">
          <Sidebar />

          <main className="p-5">{children}</main>
        </div>
      </div>
    </Provider>
  )
}
