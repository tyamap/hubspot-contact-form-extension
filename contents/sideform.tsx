import axios from "axios"
import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { useMessage } from "@plasmohq/messaging/hook"
import { useStorage } from "@plasmohq/storage/hook"

import type { Tokens } from "~entities/tokens"
import { refreshAuthToken } from "~lib/auth"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: false,
  run_at: "document_end"
}

type ContactInputs = {
  email: string
  firstname: string
  lastname: string
  phone?: string
  company?: string
  website?: string
  lifecyclestage?: string
}

const Sideform = () => {
  const [show, setShow] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ContactInputs>()
  const [tokens, setTokens] = useStorage<Tokens>("tokens")

  // ポップアップのボタンをトリガーにサイドフォームの表示切り替え
  useMessage(async (req, _res) => {
    if (req.name === "toggleSideform") {
      setShow(!show)
    }
  })

  const onSubmit = (data: ContactInputs) => {
    const isExpired = new Date() > new Date(tokens.expiredAt)

    if (isExpired) {
      refreshAuthToken(tokens.refreshToken).then((tokens) => {
        setTokens(tokens)
        createContact(data, tokens.accessToken)
      })
    } else {
      createContact(data, tokens.accessToken)
    }
  }

  // コンタクトの作成
  const createContact = (formData, accessToken: string) => {
    setLoading(true)
    const url = `${process.env.PLASMO_PUBLIC_API_ROOT}/api/v1/create-contact`
    const headers = {
      "Content-Type": "application/json"
    }
    const data = { properties: formData, accessToken: accessToken }
    axios.post(url, data, { headers }).then((res) => {
      if (res.status === 201) {
        alert("登録しました")
        setShow(false)
      } else {
        alert("登録に失敗しました")
      }
    }).catch((e) => { 
      console.error(e)
    })
  }

  return (
    show && (
      <div className="fixed top-0 right-0 bg-white w-96 h-full drop-shadow-2xl">
        {tokens?.refreshToken ? (
          <>
            <div className="p-4 bg-orange-500 text-white flex justify-between">
              <text>コンタクトを作成</text>
              <button onClick={() => setShow(false)}>X</button>
            </div>
            <div className="p-4">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className={blockStyle}>
                  <label className={labelStyle} htmlFor="email">
                    Email
                  </label>
                  <input
                    className={inputStyle}
                    type="email"
                    {...register("email")}
                  />
                  {errors.email && <span>This field is required</span>}
                </div>
                <div className={blockStyle}>
                  <label className={labelStyle} htmlFor="firstname">
                    First Name
                  </label>
                  <input
                    className={inputStyle}
                    type="text"
                    {...register("firstname")}
                  />
                </div>
                <div className={blockStyle}>
                  <label className={labelStyle} htmlFor="lastname">
                    Last Name
                  </label>
                  <input
                    className={inputStyle}
                    type="text"
                    {...register("lastname")}
                  />
                </div>
                <div className={blockStyle}>
                  <label className={labelStyle} htmlFor="phone">
                    Phone
                  </label>
                  <input
                    className={inputStyle}
                    type="text"
                    {...register("phone")}
                  />
                </div>
                <div className={blockStyle}>
                  <label className={labelStyle} htmlFor="company">
                    Company
                  </label>
                  <input
                    className={inputStyle}
                    type="text"
                    {...register("company")}
                  />
                </div>
                <div className={blockStyle}>
                  <label className={labelStyle} htmlFor="website">
                    Website
                  </label>
                  <input
                    className={inputStyle}
                    type="text"
                    {...register("website")}
                  />
                </div>
                <div className={blockStyle}>
                  <label className={labelStyle} htmlFor="lifecyclestage">
                    Lifecyclestage
                  </label>
                  <input
                    className={inputStyle}
                    type="text"
                    {...register("lifecyclestage")}
                  />
                </div>
                <input
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded float-right"
                  type="submit"
                />
              </form>
            </div>
          </>
        ) : (
          <>設定からHubSpotにログインしてください</>
        )}
      </div>
    )
  )
}

export default Sideform

const inputStyle =
  "bg-gray-100 appearance-none border-2 border-gray-300 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-orange-500"
const labelStyle = "text-black"
const blockStyle = "flex flex-col mb-4"
