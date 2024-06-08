'use client'

import Darkmode from '@/components/darkmode'
import { Logo } from '@/components/navbar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { HamburgerMenuIcon, PlusIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const data = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Account',
    href: '/account',
  },
] as {
  title: string
  href: string
  devOnly?: boolean
}[]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <HamburgerMenuIcon className="fixed right-5 top-3.5 size-7 cursor-pointer lg:hidden" />
        </SheetTrigger>
        <SheetContent className="max-w-72 p-0 lg:hidden">
          <div className="border-b">
            <Logo />
          </div>

          <SidebarItems pathname={pathname} />
        </SheetContent>
      </Sheet>

      <div className="hidden border-r bg-background lg:block">
        <SidebarItems pathname={pathname} />
      </div>
    </>
  )
}

const SidebarItems = ({ pathname }: { pathname: string }) => {
  return (
    <div className="p-5">
      <div className="grid gap-y-2">
        {data.map((item) => (
          <SidebarItem
            key={item.title}
            title={item.title}
            href={item.href}
            active={pathname.startsWith(item.href)}
            devOnly={item.devOnly}
          />
        ))}
      </div>

      <div className="my-12" />

      <Link
        className="flex items-center justify-between rounded-md border px-3 py-2 font-medium text-primary/75"
        href={'/billing'}
      >
        1000 Zen <PlusIcon className="size-5" />
      </Link>

      <div className="my-12" />

      <Darkmode />
    </div>
  )
}

const SidebarItem = ({
  title,
  href,
  active,
  devOnly,
}: {
  title: string
  href: string
  active: boolean
  devOnly?: boolean
}) => {
  return (
    <Link
      className={cn(
        'text-primary/70',
        active ? 'font-semibold text-primary' : 'hover:text-primary',
        devOnly && process.env.NODE_ENV === 'development' ? 'block' : 'block',
      )}
      href={href}
    >
      {title}
    </Link>
  )
}
