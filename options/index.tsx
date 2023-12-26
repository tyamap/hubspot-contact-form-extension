import "~/style.css"

import axios from "axios"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { useStorage } from "@plasmohq/storage/hook"

import type { Tokens } from "~entities/tokens"
import { refreshAuthToken } from "~lib/auth"

type PropertyGroup = {
  [groupName: string]: Property[]
}

const Options = () => {
  const HUBSPOT_SCOPE = "crm.objects.contacts.read%20crm.objects.contacts.write"

  const [tokens, setTokens] = useStorage<Tokens>("tokens")
  const [propertySettings, setPropertySettings] =
    useStorage<Property[]>("PropertySettings")
  const [propertyGroups, setPropertyGroups] = useState<PropertyGroup>({})
  const [properties, setProperties] = useState<Property[]>([])
  const [settingProgress, setSettingProgress] = useState<boolean>(false)
  const propsSelectForm = useForm<{ props: string[] }>()

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

  const onClick = () => {
    const isExpired = new Date() > new Date(tokens.expiredAt)

    if (isExpired) {
      refreshAuthToken(tokens.refreshToken).then((tokens) => {
        setTokens(tokens)
        getProperties(tokens.accessToken)
      })
    } else {
      getProperties(tokens.accessToken)
    }
  }

  // コンタクトの作成
  const getProperties = (accessToken: string) => {
    const url = `${process.env.PLASMO_PUBLIC_API_ROOT}/api/v1/get-properties`
    const headers = {
      "Content-Type": "application/json"
    }
    const data = { accessToken: accessToken }
    axios
      .post(url, data, { headers })
      .then((res) => {
        console.log(res)

        setProperties(res.data.results)
        const result = res.data.results.reduce((group, p) => {
          group[p.groupName] = group[p.groupName] ?? []
          group[p.groupName].push(p)
          return group
        }, {})
        console.log(result)
        setPropertyGroups(result)
        setSettingProgress(true)
      })
      .catch((e) => {
        console.error(e)
      })
  }

  const onSubmit = (data) => {
    const selectedProps = properties.filter((prop) =>
      data.props.includes(prop.name)
    )
    console.log(selectedProps)
    setPropertySettings(selectedProps)
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      {tokens?.refreshToken ? (
        <div>
          <div className="text-center">認証済み</div>
          {propertySettings && (
            <>
              <h2>選択済プロパティー</h2>
              <ul>
                {propertySettings.map((prop) => (
                  <li key={prop.name}>{prop.label}</li>
                ))}
              </ul>
            </>
          )}
          {settingProgress ? (
            <div className="max-w-4xl m-auto">
              <form onSubmit={propsSelectForm.handleSubmit(onSubmit)}>
                <input
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mb-4"
                />
                {Object.keys(propertyGroups).map((groupName) => (
                  <div key={groupName || "no_group"}>
                    <h2 className="text-lg font-bold mb-2">
                      {groupName || "no_group"}
                    </h2>
                    <div className="flex flex-wrap">
                      {propertyGroups[groupName].map((prop) => (
                        <div key={prop.name} className="w-1/2 mb-4">
                          <label>
                            <input
                              type="checkbox"
                              className="align-[-2px] mr-1"
                              value={prop.name}
                              {...propsSelectForm.register("props")}
                            />
                            <span className="font-bold">{prop.label}</span>
                          </label>
                          <p className="pl-4 pr-4">{prop.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </form>
            </div>
          ) : (
            <button
              onClick={onClick}
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mb-4">
              プロパティー取得
            </button>
          )}
        </div>
      ) : (
        <button onClick={handleClickAuth}>HubSpot認証</button>
      )}
    </div>
  )
}

export default Options
