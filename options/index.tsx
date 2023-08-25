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

        const formData = new URLSearchParams()
        formData.append("grant_type", "authorization_code")
        formData.append(
          "client_id",
          process.env.PLASMO_PUBLIC_HUBSPOT_CLIENT_ID
        )
        formData.append(
          "client_secret",
          process.env.PLASMO_PUBLIC_HUBSPOT_CLIENT_SECRET
        )
        formData.append(
          "redirect_uri",
          process.env.PLASMO_PUBLIC_HUBSPOT_REDIRECT_URL
        )
        formData.append("code", code)

        fetch("https://api.hubapi.com/oauth/v1/token", {
          method: "post",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData
        })
          .then((res) => res.json())
          .then((json) => {
            const refreshToken = json["refresh_token"]
            const accessToken = json["access_token"]
            console.log(refreshToken)
            console.log(accessToken)
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
