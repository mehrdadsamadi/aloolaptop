'use client'

import { createContext, ReactNode, useState } from 'react'
import { Roles } from '@/lib/enums/roles.enum'
import { toast } from 'sonner'

interface User {
  id: string
  mobile: string
  role: Roles
  profile: {
    firstName: string
    lastName: string
    avatar: {
      url: string
      key: string
    }
  }
}

interface UserContextType {
  user: User | null
  saveUser: (user: User) => void
  removeUser: () => void
  logout: () => void
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  const saveUser = (user: User) => {
    const { id, role, profile, mobile } = user

    const data = { id, role, profile, mobile }

    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
  }

  const removeUser = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  const logout = () => {
    removeUser()
    document.location.href = '/auth/logout'

    toast.success('شما با موفقیت از حساب کاربری خود خارج شدید')
  }

  return <UserContext.Provider value={{ user, saveUser, removeUser, logout }}>{children}</UserContext.Provider>
}
