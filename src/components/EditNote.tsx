import { NoteData, Tag } from "../App";
import NoteForm from "./NoteForm";
import { useNote } from "./NoteLayout";

type EditNoteProps = {
  onUpdateNote: (id: string, data: NoteData) => void,
  onAddTag: (data: Tag) => void,
  avaliableTags: Tag[],
}

export default function EditNote({onUpdateNote,...props}: EditNoteProps) {
  const {id, ...note} = useNote()
  
  return (
    <>
      <h1 className="mb-4">New Note</h1>
      <NoteForm 
        onSubmit={(data) => onUpdateNote(id, data)} 
        {...note}
        {...props}
      />
    </>
  )
}