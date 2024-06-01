import * as React from 'react'

interface EmailTemplateProps {
  forename: string
  starter: string
  main: string
  pudding: string
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  forename,
  starter,
  main,
  pudding
}) => (
  <div>
    <h1>
      {forename} has just submitted their menu choice. They have chosen{' '}
      {starter} for starter, {main} for their main, and {pudding} for their
      pudding.
    </h1>
  </div>
)
