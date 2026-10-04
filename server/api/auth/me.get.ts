export default defineEventHandler(async (event) => {
  return { user: await getSessionUser(event) }
})
