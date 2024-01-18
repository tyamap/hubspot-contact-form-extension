import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import React from "react"
import { RiDraggable } from "react-icons/ri"

type Props = {
  item: Property
}

export const SortableProperty: React.FC<Props> = ({ item }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id })

  const style = {
    display: "flex",
    justifyContent: "space-between",
    border: "1px solid #ddd",
    padding: "0.5rem 1rem",
    backgroundColor: "#fafafa",
    cursor: "move",
    listStyle: "none",
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {item.label}
      <RiDraggable size='1.2rem' />
    </div>
  )
}
