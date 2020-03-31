const path = require('path')
const express = require('express')
const xss = require('xss')
const NotesService = require('./notes-service')


const notesRouter = express.Router()
const jsonParser = express.json()


const serializeNote = note=> ({
    id: note.id,
    note_name: note.note_name,
    note_content:  note.note_content
})

notesRouter
.route('/notes')
.get((req, res, next) => {
    const knexInstance = req.app.get('db')
    NotesService.getAllNotes(knexInstance)
    .then(notes => {
        res.json(notes.map(serializeNote))
    })
    .catch(next)
})
.post(jsonParser, (req, res, next) => {
    const { note_name, note_content } = req.body
    const newNote = {  note_name  }

    for(const [key, value ] of Object.entries(newNote)) {
        if(value == null) {
            return res.status(400).json({
                error: { message: `Missing '${key}' in request body` }
            })
        }
    }

    newNote.note_name = note_name;
    newNote.note_content = note_content;


    NotesService.insertNote(
        req.app.get('db'),
        newNote
    )
    .then(note => {
        res
        status(201)
        .location(path.posix.join(req.DB_URL, `/${note.id}`))
        .json(serializeFolder(note))
    })
    .catch(next)
})
notesRouter
.route(' /:note_id')
.all((req, res, next) => {
    ArticlesService.getById(
        req.app.get('db'),
        req.params.note_id
    )
    .then(note => {
        if(!note) {
            return res.status(404).json({
                error: { message: `Note doesn't exist` }
            })
        }
        res.note= note
        next()
    })
    .catch(next)
})
.get((req, res, next) => {
    res.json(serializeNote(res.note))
})
.delete((req, res, next) => {
    NotesService.deleteNote(
        req.app.get('db'),
        req.params.note_id
    )
    .then(numRowsAffected => {
        res.status(204).end()
    })
    .catch(next)
})
.patch(jsonParser, (req, res, next) => {
    const { note_name, note_content} = req.body
    const noteToUpdate = { note_name, note_content }

    const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length
    if(numberOfValues === 0 ) 
    return res.status(400).json({
        error: { message: `Request body must contain an 'note_name' or a 'note_content' `}
    })
    NotesService.updateNote(
        req.app.get('db'),
        req.params.note_id,
        noteToUpdate
    )
    .then(numRowsAffected => {
        res.status(204).end()
    })
    .catch(next)
})
module.exports = notesRouter