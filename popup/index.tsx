const Popup = () => {
  const openOptionPage = () => {
    chrome.runtime.openOptionsPage()
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
    </div>
  )
}

export default Popup
