import React from 'react'
import { useSettings } from '../hooks/useSettings'

const Footer = () => {
  const { settings } = useSettings()
  return (
    <div className="py-4">
      <div>
        <div>
          <p dangerouslySetInnerHTML={{ __html: settings?.account?.global_footer_html || "" }}></p>
          <p dangerouslySetInnerHTML={{ __html: settings?.app?.footer_text || "" }}></p>
          <p>
            &copy; {new Date().getFullYear()} {settings?.app?.company_name}. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Footer