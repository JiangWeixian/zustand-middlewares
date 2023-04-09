import browsers from 'webextension-polyfill'
import type { StateStorage } from 'zustand/middleware'

export const local: StateStorage = {
  getItem: async (name: string) => {
    const result = await browsers.storage.local.get(name)
    return result[name]
  },
  setItem(name, value) {
    return browsers.storage.local.set({ [name]: value })
  },
  removeItem(name) {
    return browsers.storage.local.remove(name)
  },
}

export const sync: StateStorage = {
  getItem: async (name: string) => {
    const result = await browsers.storage.sync.get(name)
    return result[name]
  },
  setItem(name, value) {
    return browsers.storage.sync.set({ [name]: value })
  },
  removeItem(name) {
    return browsers.storage.sync.remove(name)
  },
}
