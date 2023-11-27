import axios from "axios"

import { useStorage } from "@plasmohq/storage/hook"

import type { Tokens } from "~entities/tokens"
import { refreshAuthToken } from "~lib/auth"

const Options = () => {
  const HUBSPOT_SCOPE = "crm.objects.contacts.read%20crm.objects.contacts.write"

  const [tokens, setTokens] = useStorage<Tokens>("tokens")

  const handleClickAuth = () => {
    // 自身のChrome拡張IDを含んだURLをリダイレクト先とする
    const redirectUrl = chrome.identity.getRedirectURL("oauth2")
    chrome.identity.launchWebAuthFlow(
      {
        url: `https://app.hubspot.com/oauth/authorize?client_id=${process.env.PLASMO_PUBLIC_HUBSPOT_CLIENT_ID}&redirect_uri=${redirectUrl}&scope=${HUBSPOT_SCOPE}`,
        interactive: true
      },
      (responseUrl) => {
        const url = new URL(responseUrl)
        const code = url.searchParams.get("code")

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
        formData.append("redirect_uri", redirectUrl),
          formData.append("code", code)

        axios
          .post("https://api.hubapi.com/oauth/v1/token", formData)
          .then((res) => {
            const refreshToken = res.data["refresh_token"]
            const accessToken = res.data["access_token"]
            const expiresIn = res.data["expires_in"]
            // トークン期限を設定
            const expiredAt = expiresIn
              ? new Date(new Date().getTime() + expiresIn * 1000)
              : new Date()
            setTokens({
              refreshToken,
              accessToken,
              expiredAt: expiredAt.toString()
            })
          })
      }
    )
  }

  const handleClickRefresh = () => {
    // 現在の日時とアクセストークンの有効期限を比較して、有効かどうか判定
    // HubSpot のリフレッシュトークンは失効しない
    const isExpired = new Date() > new Date(tokens.expiredAt)

    if (isExpired) {
      refreshAuthToken(tokens.refreshToken).then((tokens) => {
        setTokens(tokens)
      })
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      {tokens?.refreshToken ? (
        <div>認証済み</div>
        ) : (
        <button onClick={handleClickAuth}>HubSpot認証</button>
      )}
    </div>
  )
}

export default Options
