import "~/style.css";
import { sendToContentScript } from "@plasmohq/messaging";

const Popup = () => {
  const openOptionPage = () => {
    chrome.runtime.openOptionsPage()
  }
  const showSideform = async () => {
    await sendToContentScript({
      name: "toggleSideform"
    })
    window.close()
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16,
        width: 260
      }}>
      <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mb-4" onClick={showSideform}>起動</button>
      <button onClick={openOptionPage}>設定</button>
    </div>
  )
}

export default Popup