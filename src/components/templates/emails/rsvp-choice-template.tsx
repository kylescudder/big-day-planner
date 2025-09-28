import * as React from 'react'

interface EmailTemplateProps {
  forename: string
  rsvpAnswer: boolean
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  forename,
  rsvpAnswer
}) => (
  <div>
    <p>
      {forename} has submitted their RSVP!
      {rsvpAnswer === true
        ? '\nThey will be attending!'
        : '\nThey will not be attending.'}
    </p>
  </div>
)
