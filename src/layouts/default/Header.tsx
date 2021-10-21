import { useEffect, useState } from 'react'

import logo from '@/assets/images/base/logo.png'
import humberger from '@/assets/images/base/humberger.svg'
import ConnectWallet from '@/components/base/ConnectWallet'
import { Link, useLocation } from 'react-router-dom'

function Header() {
  const [openMobileNav, setOpenMobileNav] = useState(false)

  const location = useLocation()

  const routes = ['/marketplace', '/account']
  useEffect(() => {
    setOpenMobileNav(false)
  }, [location])

  return (
    <header className="bg-black bg-opacity-90 lg:bg-opacity-50 z-10 w-full fixed top-0 text-white">
      <div className="flex flex-row lg:flex-row lg:items-center justify-between lg:justify-normal w-full lg:px-20 xl:px-40">
        <div className="px-4 md:px-8 lg:px-0 flex items-center">
          <a href="https://mechmaster.io/" target="_blank" rel="noopener noreferrer">
            <img alt="" src={logo} className="h-10" />
          </a>
        </div>
        <ul className="hidden lg:flex flex-row text-white items-center justify-center gap-6 font-bold uppercase my-2 lg:my-0 lg:ml-8">
          <li className="active">
            <a href="https://mechmaster.io/" target="_blank" rel="noopener noreferrer">
              Home
            </a>
          </li>
          {routes.map((route) => (
            <li key={route} className={`${location.pathname.includes(route) ? 'text-sky-300' : ''}`}>
              <Link to={route}>{route.replaceAll('/', '')}</Link>
            </li>
          ))}
        </ul>
        <div className="hidden lg:block lg:ml-auto py-4">
          <ConnectWallet />
        </div>
        <div className="lg:hidden h-full">
          <button
            onClick={() => setOpenMobileNav(true)}
            className="w-16 h-16 flex justify-center items-center focus:outline-none"
            css={{
              background: 'radial-gradient(50% 50% at 50% 50%, #2A6476 0%, rgba(29, 68, 98, 0.54) 100%)',
            }}
          >
            <img src={humberger} alt="" />
          </button>
        </div>
      </div>
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-full bg-blue-gray-900 bg-opacity-95 transform overflow-auto ease-in-out transition-all duration-300 z-30 ${
          openMobileNav ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          <button
            onClick={() => setOpenMobileNav(false)}
            className="ml-auto w-16 h-16 flex justify-center items-center focus:outline-none"
          >
            <img src={humberger} alt="" />
          </button>
        </div>

        <ul className="flex flex-col text-white items-center justify-center gap-2 font-bold uppercase my-2 lg:my-0 lg:ml-8">
          <li className="w-full py-2 flex justify-center ">
            <a href="https://mechmaster.io/" target="_blank" rel="noopener noreferrer">
              Home
            </a>
          </li>
          {routes.map((route) => (
            <li
              key={route}
              className={`w-full py-2 flex justify-center ${
                location.pathname.includes(route) ? 'bg-opacity-80 active bg-sky-500' : ''
              }`}
            >
              <Link to={route}>{route.replaceAll('/', '')}</Link>
            </li>
          ))}
          <li className="w-full py-2 flex justify-center">
            <ConnectWallet />
          </li>
        </ul>
      </div>
    </header>
  )
}

export default Header
