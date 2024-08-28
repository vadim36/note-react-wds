import { Badge, Button, Card, Col, Form, Modal, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import Select from "react-select";
import { Note, Tag } from "../App";
import { useMemo, useState } from "react";
import styles from './NoteList.module.css'

type NoteListProps = {
  avaliableTags: Tag[],
  notes: Note[],
  updateTag: (id: string, label: string) => void, 
  deleteTag: (id: string) => void
}

type SimplifiedNote = {
  tags: Tag[],
  title: string
  id: string
}

type EditTagsModalProps = {
  show: boolean,
  avaliableTags: Tag[],
  handleClose: () => void,
  onUpdateTag: (id: string, label: string) => void, 
  onDeleteTag: (id: string) => void
}

export function NoteList({ 
  avaliableTags, 
  notes, 
  updateTag, 
  deleteTag 
}: NoteListProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [title, setTitle] = useState<string>('')
  const [isOpenEditTagsModal, setIsOpenEditTagsModal] = useState<boolean>(false)

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      return (title === "" || note.title.toLowerCase().includes(title.toLowerCase()))
        && (selectedTags.length === 0 || selectedTags.every(tag => {
          return note.tags.some(noteTag => noteTag.id === tag.id)
        }))
    })
  }, [title, notes, selectedTags])

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col><h1>Notes</h1></Col>
        <Col xs="auto">
          <Stack direction="horizontal" gap={2}>
            <Link to="/new">
              <Button>Create</Button>
            </Link>
            <Button variant="outline-secondary" onClick={() => setIsOpenEditTagsModal(true)}>
              Edit tags
            </Button>
          </Stack>
        </Col>
      </Row>
      <Form>
        <Row>
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control value={title} onChange={e => setTitle(e.target.value)} type="text"/>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <Select 
                isMulti 
                value={selectedTags.map((tag) => {
                  return { label: tag.label, value: tag.id }
                })} 
                options={avaliableTags.map(tag => {
                  return { label: tag.label, value: tag.id }
                })}
                onChange={(tags) => {
                  setSelectedTags(tags.map((tag) => {
                    return { label: tag.label, id: tag.value }
                  }))
                }}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Row xs={1} sm={2} lg={3} xl={4} className="g-3 mt-4">
        {filteredNotes.map(({markdown, ...noteData}: Note) => {
          return <Col key={noteData.id}>
            <NoteCard {...noteData}/>
          </Col>
        })}
      </Row>
      <EditTagsModal 
        show={isOpenEditTagsModal} 
        handleClose={() => setIsOpenEditTagsModal(false)}
        avaliableTags={avaliableTags}
        onUpdateTag={updateTag}
        onDeleteTag={deleteTag}
      />
    </>
  )
}

function NoteCard({ id, tags, title }: SimplifiedNote) {
  return (
    <Card 
      as={Link} to={`/${id}`} 
      className={`h-100 text-reset text-decoration-none ${styles.card}`}
    >
      <Card.Body>
        <Stack gap={2} className="align-items-center justify-content-center h-100">
          <span className="fs-5">{title}</span>
          {tags.length > 0 && (
            <Stack 
              gap={1} 
              direction="horizontal"
              className="justify-content-center flex-wrap"
            >
              {tags.map((tag) => {
                return <Badge className="text-truncate" key={tag.id}>{tag.label}</Badge>
              })}
            </Stack>
          )}
        </Stack>
      </Card.Body>
    </Card>
  )
}

function EditTagsModal({
  show, 
  handleClose, 
  avaliableTags,
  onUpdateTag,
  onDeleteTag
}: EditTagsModalProps) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Tags</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack gap={2}>
            {avaliableTags.map(tag => {
              return <Row key={tag.id}>
                <Col>
                  <Form.Control type="text" value={tag.label} onChange={(e) => {
                    onUpdateTag(tag.id, e.target.value)
                  }}/>
                </Col>
                <Col xs="auto">
                  <Button variant="outline-danger" onClick={() => {
                    onDeleteTag(tag.id)
                  }}>&times;</Button>
                </Col>
              </Row>
            })}
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  )
}