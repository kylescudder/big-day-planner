import * as React from 'react'

interface EmailTemplateProps {
  forename: string
  starter: string | null
  main: string | null
  pudding: string | null
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  forename,
  starter,
  main,
  pudding
}) => (
  <div>
    <p>
      {forename} has just submitted their menu choice. They have chosen the
      following:
    </p>
    <ul>
      {starter !== null ? <li>{starter} for starter</li> : null}
      {main !== null ? <li>{main} for main</li> : null}
      {pudding !== null ? <li>{pudding} for pudding</li> : null}
    </ul>
  </div>
)
