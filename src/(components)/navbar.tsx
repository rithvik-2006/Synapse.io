
"use client"

import { useState } from "react"
import { BookOpen, Briefcase, Dumbbell, Home, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}



export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems: NavItem[] = [
    { name: "Home", href: "/", icon: Home },
    { name: "Study", href: "/study", icon: BookOpen },
    { name: "Work", href: "/work", icon: Briefcase },
    { name: "Gym", href: "/gym", icon: Dumbbell }
  ]

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)


  return (
    <nav className="bg-black border-b border-neutral-800 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link href="/">
          <div className="flex items-center">
            <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Image src="/logo.svg" alt="Synapse" width={32} height={32} />
              Synapse
            </h1>
          </div>
          </Link>

          <div className="hidden md:block">
  <div className="ml-10 flex items-center space-x-6">
    {navItems.map((item) => {
      const IconComponent = item.icon;
      return (
        <a
          key={item.name}
          href={item.href}
          className="group px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 text-gray-300 hover:bg-neutral-800 hover:text-white"
        >
          <IconComponent
            size={16}
            className="transition-colors duration-200 text-gray-400 group-hover:text-white"
          />
          {item.name}
        </a>
      );
    })}
  </div>
</div>


          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-neutral-800 transition"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>


      {isMobileMenuOpen && (
  <div className="md:hidden animate-slide-down">
    <div className="px-3 pt-3 pb-4 space-y-2 bg-black border-t border-neutral-800 shadow-lg">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <a
            key={item.name}
            href={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className="group block px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 flex items-center gap-3 text-gray-300 hover:bg-neutral-800 hover:text-white"
          >
            <IconComponent
              size={18}
              className="transition-colors duration-200 text-gray-400 group-hover:text-white"
            />
            {item.name}
          </a>
        );
      })}
    </div>
  </div>
)}
    </nav>
  )
}