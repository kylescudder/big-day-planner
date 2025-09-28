import * as React from 'react'

interface EmailTemplateProps {
  forename: string
  song: string
  artist: string
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  forename,
  song,
  artist
}) => (
  <div>
    <p>
      {forename} has just submitted {song} by {artist} as their song choice!
      Don&apos;t forget to add it to the playlist!
    </p>
  </div>
)
