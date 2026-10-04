import type { CategoryGroup } from '~~/types/types'

export default defineEventHandler(async (): Promise<CategoryGroup[]> => {
  return categoryGroups(await getCatalog())
})
