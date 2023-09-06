import { sendToContentScript } from "@plasmohq/messaging"

const Popup = () => {
  const openOptionPage = () => {
    chrome.runtime.openOptionsPage()
  }
  const showSideform = async () => {
    await sendToContentScript({
      name: "toggleSideform"
    })
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16,
        width: 260
      }}>
      <button onClick={openOptionPage}>設定</button>
      <button onClick={showSideform}>起動</button>
    </div>
  )
}

export default Popup
