import { Container } from "react-bootstrap";
import { Navigate, Route, Routes } from "react-router-dom";
import NewNote from "./components/NewNote";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useMemo } from "react";
import { v4 as uuidV4 } from 'uuid'
import { NoteList } from "./components/NoteList";
import { NoteLayout } from "./components/NoteLayout";
import { Note } from "./components/Note";
import EditNote from "./components/EditNote";

export type Note = {
  id: string
} & NoteData

export type RawNote = {
  id: string
} & RawNoteData

export type RawNoteData = {
  title: string
  markdown: string
  tagIds: string[]
}

export type NoteData = {
  title: string
  markdown: string
  tags: Tag[]
}

export type Tag = {
  id: string
  label: string
}

export default function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", [])
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", [])

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {...note, tags: tags.filter((tag) => {
        return note.tagIds.includes(tag.id)
      })}
    })
  }, [notes, tags])

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return [
        ...prevNotes, 
        { ...data, id: uuidV4(), tagIds: tags.map(tag => tag.id) }
      ]
    })
  }

  function onUpdateNote(id: string, { tags, ...data}: NoteData) {
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return {...note, ...data, tagIds: tags.map(tag => tag.id) }
        }
          
        return note
      })
    })
  }

  function onDeleteNote(id: string) {
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.id !== id)
    })
  }

  function addTag(tag: Tag) {
    setTags(prev => [...prev, tag])
  }

  function updateTag(id: string, label: string) {
    setTags((prevTags) => {
      return prevTags.map((tag) => {
        if (tag.id === id) {
          return {...tag, label }
        }
          
        return tag
      })
    })
  }

  function deleteTag(id: string) {
    setTags(prev => prev.filter((tag) => tag.id !== id))
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route path='/' element={
          <NoteList 
            notes={notesWithTags} 
            avaliableTags={tags}
            deleteTag={deleteTag}
            updateTag={updateTag}
          />
        }/>
        <Route path='/new' element={
          <NewNote onSubmit={onCreateNote} onAddTag={addTag} avaliableTags={tags}/>
        }/>
        <Route path='/:id' element={<NoteLayout notes={notesWithTags}/>}>
          <Route index element={<Note onDelete={onDeleteNote}/>}/>
          <Route path='edit' element={
            <EditNote onUpdateNote={onUpdateNote} onAddTag={addTag} avaliableTags={tags}/>
          }/>
        </Route>
        <Route path='*' element={<Navigate to="/"/>}/>
      </Routes>
    </Container>
  )
}