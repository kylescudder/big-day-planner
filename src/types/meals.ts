import { Main, Pudding, Starter } from '@/server/db/schema'

export interface Meals {
  starters: Starter[]
  mains: Main[]
  puddings: Pudding[]
}
