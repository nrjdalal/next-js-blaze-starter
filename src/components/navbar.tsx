import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="sticky top-0 flex h-14 items-center justify-between border-b bg-background">
      <Logo />
    </nav>
  )
}

export const Logo = () => {
  return (
    <Link
      href={'/dashboard'}
      className="flex h-14 w-72 items-center gap-x-2 px-5 lg:border-r"
    >
      <svg
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M24 22h-24l12-20z" />
      </svg>
      <p className="text-xl font-bold">ACME</p>
    </Link>
  )
}
