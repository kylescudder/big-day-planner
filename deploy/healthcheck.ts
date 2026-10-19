// Container healthcheck: the app must serve pages and reach its tables.
const origin = `http://127.0.0.1:${process.env.PORT || 3000}`
for (const path of ['/', '/api/health']) {
  const response = await fetch(origin + path, {
    signal: AbortSignal.timeout(5000)
  })
  if (!response.ok) throw new Error(`${path} returned ${response.status}`)
}
