import { NoteData, Tag } from "../App";
import NoteForm from "./NoteForm";

type NewNoteProps = {
  onSubmit: (data: NoteData) => void,
  onAddTag: (data: Tag) => void,
  avaliableTags: Tag[]
}

export default function NewNote({...props}: NewNoteProps) {
  return (
    <>
      <h1 className="mb-4">New Note</h1>
      <NoteForm {...props}/>
    </>
  )
}