import { CoolSidebar } from '@/components/coolsidebar'
import React from 'react'

const chat = ({user}) => {
  return (
    <div className='text-black'>
      <CoolSidebar/>
      {user}
    </div>
  )
}

export default chat
