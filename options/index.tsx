const Options = () => {
  const HUBSPOT_SCOPE = "crm.objects.contacts.read%20crm.objects.contacts.write"

  const handleClickAuth = () => {
    chrome.identity.launchWebAuthFlow(
      {
        url: `https://app.hubspot.com/oauth/authorize?client_id=${process.env.PLASMO_PUBLIC_HUBSPOT_CLIENT_ID}&redirect_uri=${process.env.PLASMO_PUBLIC_HUBSPOT_REDIRECT_URL}&scope=${HUBSPOT_SCOPE}`,
        interactive: true
      },
      (responseUrl) => {
        let url = new URL(responseUrl)
        let code = url.searchParams.get("code")

        fetch("https://api.hubapi.com/oauth/v1/token", {
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            grant_type: "authorization_code",
            client_id: process.env.PLASMO_PUBLIC_HUBSPOT_CLIENT_ID,
            client_secret: process.env.PLASMO_PUBLIC_HUBSPOT_CLIENT_SECRET,
            redirect_uri: process.env.PLASMO_PUBLIC_HUBSPOT_REDIRECT_URL,
            code: code
          })
        })
          .then((res) => res.json())
          .then((json) => {
            const token = json["token"] // アクセストークン取得
            alert(token)
          })
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
