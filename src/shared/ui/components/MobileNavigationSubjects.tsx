'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

interface Subject {
  id: number
  name: string
}

interface MobileNavigationSubjectsProps {
  data: Subject[]
  onClose: () => void // Callback to close the mobile menu after navigation
}

export default function MobileNavigationSubjects({ data, onClose }: MobileNavigationSubjectsProps) {
  const router = useRouter()

  const handleNavigation = (id: number) => {
    router.push(`/teacher/${id}`)
    onClose() // Close the menu after navigating
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg rounded-t-lg py-3 px-4 max-h-28 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">Предметы</h3>
      <nav>
        <ul className="flex overflow-x-auto pb-2
                   [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-blue-500">
          {data.map((item) => (
            <li key={item.id} className="flex-shrink-0 mr-2 whitespace-nowrap">
              <button
                onClick={() => handleNavigation(item.id)}
                className="block py-2 px-4 rounded-full text-gray-700 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-sm"
              >
                <span className="font-medium">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
