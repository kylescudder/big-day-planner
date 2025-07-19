import * as React from 'react'

interface EmailTemplateProps {
  forename: string
  rsvpAnswer: boolean
  bride: string
  groom: string
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  forename,
  rsvpAnswer,
  bride,
  groom
}) => (
  <div>
    <p>
      Hey {forename}! Thank you for submitting your RSVP.
      {rsvpAnswer
        ? `${bride} and ${groom} are so excited to see you there!`
        : "\nWe are really sorry that you aren't going to be there to celebrate with us, but look forward to seeing you soon for a catch up."}
    </p>
  </div>
)
