import { avatarRequest, prepareAvatar } from './profile'

// Optional name fields shown on the profile, plus the read-only verified email.
const nameField = (name: string, label: string) => ({
  name,
  type: 'string' as const,
  label,
  defaultValue: '',
  validateDebounceMs: 0,
  validate: (value: unknown) => {
    if (typeof value === 'string' && value.length > 100)
      throw new Error('Use up to 100 characters.')
  }
})

export const profileFields = [
  nameField('givenName', 'First name'),
  nameField('familyName', 'Last name'),
  {
    name: 'email',
    type: 'string' as const,
    label: 'Verified email',
    readOnly: true,
    copyable: true
  }
]

// The profile photo is stored privately in the app's database through
// /api/profile/avatar, never in UploadThing.
export const profileAvatar = {
  enabled: true,
  size: 512,
  extension: 'jpg' as const,
  resize: async (file: File) =>
    new File([await prepareAvatar(file)], 'avatar.jpg', { type: 'image/jpeg' }),
  upload: async (file: File) => {
    const { image } = await avatarRequest({
      method: 'PUT',
      headers: { 'Content-Type': 'image/jpeg' },
      body: file
    })
    if (!image) throw new Error('The photo could not be uploaded.')
    return image
  },
  delete: async () => {
    await avatarRequest({ method: 'DELETE' })
  }
}
