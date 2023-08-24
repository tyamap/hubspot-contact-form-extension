const Options = () => {
  const HUBSPOT_SCOPE = "crm.objects.contacts.read%20crm.objects.contacts.write"

  const handleClickAuth = () => {
    chrome.identity.launchWebAuthFlow(
      {
        url: `https://app.hubspot.com/oauth/authorize?client_id=${process.env.HUBSPOT_CLIENT_ID}&redirect_uri=${process.env.HUBSPOT_REDIRECT_URL}&scope=${HUBSPOT_SCOPE}`,
        interactive: true
      },
      (responseUrl) => {
        // 後述
      }
    )
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      <button onClick={handleClickAuth}>HubSpot認証</button>
    </div>
  )
}

export default Options
