export interface NavItem {
  href: string
  label: string
}

export const navLinks: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/account', label: 'Account' },
]
