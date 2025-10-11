import * as React from 'react'

interface EmailTemplateProps {
  forename: string
  rsvpAnswer: boolean
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  forename,
  rsvpAnswer
}) => (
  <div
    style={{
      fontFamily: 'sans-serif',
      lineHeight: 1.6,
      color: '#333',
      padding: '16px'
    }}
  >
    <p>
      <strong>{forename}</strong> has submitted their RSVP.
    </p>

    <p>
      {rsvpAnswer ? (
        <span>🎉 They will be attending!</span>
      ) : (
        <span>😔 They will not be attending.</span>
      )}
    </p>
  </div>
)
