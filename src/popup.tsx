import { useState, useEffect } from "react"

function IndexPopup() {
  const [data, setData] = useState("")
  const [currentUrl, setCurrentUrl] = useState("")
  const getCurrentUrl = async () =>  {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    setCurrentUrl(tab.url)
  }
   
  useEffect(() => {
    getCurrentUrl()
  }, [currentUrl])


  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      <h2>
        You are currently at {currentUrl}
      </h2>
    </div>
  )
}

export default IndexPopup
