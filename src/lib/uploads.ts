// UploadThing's public app ID; files are served from its CDN.
const appId = import.meta.env.VITE_UT_APP_ID ?? 'xgxwpeak3r'

export function uploadUrl(key: string | null | undefined) {
  return `https://${appId}.ufs.sh/f/${key}`
}
