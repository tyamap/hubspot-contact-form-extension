import axios from "axios"

export const refreshAuthToken = (refreshToken: string) => {
  const formData = new URLSearchParams()
  formData.append("grant_type", "refresh_token")
  formData.append("client_id", process.env.PLASMO_PUBLIC_HUBSPOT_CLIENT_ID)
  formData.append(
    "client_secret",
    process.env.PLASMO_PUBLIC_HUBSPOT_CLIENT_SECRET
  )
  formData.append("refresh_token", refreshToken)
  return axios
    .post("https://api.hubapi.com/oauth/v1/token", formData)
    .then((res) => {
      const refreshToken = res.data["refresh_token"]
      const accessToken = res.data["access_token"]
      const expiresIn = res.data["expires_in"]
      // トークン期限を設定
      const expiredAt = expiresIn
        ? new Date(new Date().getTime() + expiresIn * 1000)
        : new Date()
      return ({
        refreshToken,
        accessToken,
        expiredAt: expiredAt.toString()
      })
    })
}