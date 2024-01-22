import axios from "axios"

export const refreshAuthToken = (refreshToken) => {
  const url = `${process.env.PLASMO_PUBLIC_API_ROOT}/api/v1/refresh-token`
  return axios
    .post(url, { refresh_token: refreshToken })
    .then((res) => {
      const refreshToken = res.data["refreshToken"]
      const accessToken = res.data["accessToken"]
      const expiresIn = res.data["expiresIn"]
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

export const deleteRefreshToken = (refreshToken) => {
  const url = `${process.env.PLASMO_PUBLIC_API_ROOT}/api/v1/refresh-token?refresh_token=${refreshToken}`
  return axios
    .delete(url)
    .then((res) => {
      return (res)
    })
}