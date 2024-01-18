import React from "react"

type Props = {
  name: string
}

export const FixProperty: React.FC<Props> = ({ name }: Props) => {
  const style = {
    border: "1px solid #ddd",
    padding: "0.5rem 1rem",
    backgroundColor: "#fafafa",
    listStyle: "none",
  }

  return (
    <div style={style}>
      {name}
    </div>
  )
}
