'use client'

import { createContext, ReactNode, useEffect, useState } from 'react'
import { Roles } from '@/lib/enums/roles.enum'
import { toast } from 'sonner'

export interface IUser {
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
  user: IUser | null
  saveUser: (user: IUser) => void
  removeUser: () => void
  logout: () => void
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null)

  useEffect(() => {
    const data = localStorage.getItem('user')

    if (data) {
      setUser(JSON.parse(data))
    }
  }, [])

  const saveUser = (user: IUser) => {
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
    toast.success('شما با موفقیت از حساب کاربری خود خارج شدید')

    document.location.href = '/auth/logout'
  }

  return <UserContext.Provider value={{ user, saveUser, removeUser, logout }}>{children}</UserContext.Provider>
}
