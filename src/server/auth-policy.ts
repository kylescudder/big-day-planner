// Only the couple sign in. Access needs a verified email that is still on
// AUTH_ALLOWED_EMAILS, so removing an address revokes existing sessions too.
export function isAllowedEmail(
  email: string,
  allowedEmails: readonly string[]
) {
  return allowedEmails.includes(email.trim().toLowerCase())
}

export function isVerifiedAllowedUser(
  user: { email: string; emailVerified: boolean } | null | undefined,
  allowedEmails: readonly string[]
) {
  return !!user?.emailVerified && isAllowedEmail(user.email, allowedEmails)
}
