import React from 'react'
import Folders from './Components/Folders'
import { Outlet } from 'react-router-dom'

function Home_layout() {
  return (
    <div className="flex h-full max-w-full flex-col overflow-x-hidden p-2 lg:flex-row lg:gap-0">
      <div className="w-full lg:w-[50vw] lg:flex-[0_0_50vw]">
        <Folders />
      </div>

      <div className="w-full lg:w-[50vw] lg:flex-[0_0_50vw]">
        <Outlet />
      </div>
    </div>
  )
}

export default Home_layout