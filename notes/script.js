const noteShield = document.querySelector('.add-note-shield')
const noteForm = document.querySelector('.add-note-form')
const noteTitle = document.querySelector('.note-title')
const noteBody = document.querySelector('.note-body')
const btnCloseCreation = document.querySelector('.close-note-creation')
const notesContainer = document.querySelector('.notes-container')
const deleteNote = document.querySelector('.fa-trash')
const noteCard = document.querySelector('.note-card')
const modal = document.querySelector('.modal')
const modalHeader = modal.querySelector('.modal-note-header')
const modalBody = modal.querySelector('.modal-note-body')
const closeModalBtn = modal.querySelector('.close-modal')
const updateNoteBtn = modal.querySelector('.update-note')
const colorIcon = document.querySelector('.color-icon')

let noteList = []

const date = new Date
function createNote(id, title, body) {
    id,
        title,
        body,
        color = 'has-background-white',
        created = date.toLocaleString()

    return {
        get header() {
            return title
        },

        get color() {
            return color
        },

        get body() {
            return body
        },

        get created() {
            return created
        },

        get id() {
            return id;
        },

        updateHeader(newHeader) {
            title = newHeader
        },

        updateBody(newBody) {
            body = newBody
        },

        updateColor(newColor) {
            color = newColor
        }
    }
}

// const note = createNote(1,'titulo', 'corpo')
// console.log(note)
// DOM manipulation

function toggleFrame(frameToShow) {
    for (frame of arguments) {
        frame.classList.add('is-hidden')
    }
    frameToShow.classList.remove('is-hidden')
}



// essa função faz o input crescer automaticamente
function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight) + "px";
}

function handleNoteShieldClick() {
    toggleFrame(noteForm, noteShield)
    noteBody.focus()
}

function printNoteInHTML({ id, color, header, body }) {

    let newBody = body
    let click

    if (newBody.length > 140)
        newBody = newBody.slice(0, 140) + '...'

    if (isMobile()) click = 'ondblclick'
    else click = 'onclick'

    notesContainer.innerHTML += `
    <div ${click}='handleCardClick(this)'
                            class="${color} column note-card task-card is-3-desktop is-clickable is-10-mobile is-4-tablet  card m-1">
                            <span class='note-id is-hidden'>${id}</span>
            
                            <div class="card-header-title card-title p-0">
                                <p>${header}</p>
                            </div>
            
                            <div class="card-content p-0">
                                ${newBody}
                            </div>
                            <div class="card-footer pb-0 mt-0">
                                <div class="pb-0 card-footer-item">

                                    <i class="fa card-icon p-0 fa-solid fa-palette mr-5"></i>
                                    <i class="fa card-icon p-0 fa-solid fa-trash"></i>

                                </div>
                            </div>
                            <div class="card-footer color-selector has-background-white pt-2 is-justify-content-center mt-3 is-hidden">

                                
                                    <span onclick='handleColorPicker(this)' class="has-background-white mr-2 icon color-icon"></span>
                                    <span onclick='handleColorPicker(this)' class="has-background-light mr-2 icon color-icon"></span>
                                    <span onclick='handleColorPicker(this)' class="has-background-primary mr-2 icon color-icon"></span>
                                    <span onclick='handleColorPicker(this)' class="has-background-info mr-2 icon color-icon"></span>
                                    <span onclick='handleColorPicker(this)' class="has-background-warning mr-2 icon color-icon"></span>
                                    <span onclick='handleColorPicker(this)' class="has-background-danger mr-2 icon color-icon"></span>
                                

                            </div>
            
                        </div>
    `
}

function resetForm() {
    noteTitle.value = ''
    noteBody.value = ''
}

function handleSaveButton() {
    toggleFrame(noteShield, noteForm)

    if (noteTitle.value == '' && noteBody.value == '')
        return

    let id = Math.floor(Date.now() * Math.random() * 1000)

    const note = createNote(id, noteTitle.value, noteBody.value)
    noteList.push(note)
    printNoteInHTML(note)
    resetForm()
    saveNotes()

}

function handleColorPicker(color) {
    const card = color.parentElement.parentElement
    const noteId = Number(card.querySelector('.note-id').innerText)
    const note = getObject(noteId)

    color = color.classList[0]

    note.color = color
    card.classList.replace(card.classList[0], color)
    saveNotes()
}

function launchModal(noteId) {
    const note = getObject(noteId)

    updateNoteBtn.classList.add(`${noteId}`)
    modalHeader.value = note.header
    modalBody.innerText = note.body

    modalBody.focus()

    modal.classList.add('is-active')
}

function handleCardClick(card) {
    const id = Number(card.querySelector('.note-id').innerText)
    launchModal(id)
}

function handleCloseModalBtnClick() {
    modal.classList.remove('is-active')
}

function getObject(objectId) {
    let note = noteList.filter(({ id }) => id === objectId)
    return note[0]
}

function handleSaveNoteButtonClick(e) {
    const saveButton = e.target.parentElement
    const newTitle = modalHeader.value
    const newBody = modalBody.innerText
    const noteId = Number(saveButton.classList[7])


    const note = getObject(noteId)
    console.log(saveButton)
    note.header = newTitle
    note.body = newBody

    console.log(note.header, note.body)
    // note.body(`${newBody}`)

    saveNotes()
    location.reload()
}

function handleIndividualButtonClick(e) {
    const element = e.target

    if (element.classList.contains('fa-trash')) {
        const card = e.path[3]
        const cardId = Number(card.querySelector('.note-id').innerText)

        card.remove()
        noteList = noteList.filter(({ id }) => id != cardId)
        saveNotes()

        modal.classList.remove('is-active')
    }

    if (element.classList.contains('color-icon') || element.classList.contains('fa-palette')) {
        modal.classList.remove('is-active')
    }

    if (element.classList.contains('fa-palette')) {
        const card = element.parentElement.parentElement.parentElement
        const colorSelector = card.querySelector('.color-selector')

        if (colorSelector.classList.contains('is-hidden')) {
            colorSelector.classList.remove('is-hidden')
            return
        }

        colorSelector.classList.add('is-hidden')
    }
}

noteShield.addEventListener('click', handleNoteShieldClick)
btnCloseCreation.addEventListener('click', handleSaveButton)
document.addEventListener('click', handleIndividualButtonClick)
closeModalBtn.addEventListener('click', handleCloseModalBtnClick)
updateNoteBtn.addEventListener('click', handleSaveNoteButtonClick)


// save and restore the notes --------------------
function saveNotes() {
    const notes = noteList.slice()
    const notesJSON = JSON.stringify(notes)

    localStorage.setItem('savedNotes', notesJSON)
}

function restoreNotes() {
    const notes = JSON.parse(localStorage.getItem('savedNotes'))
    noteList = notes.slice()
}

function init() {
    noteList.forEach(printNoteInHTML)
}

function isMobile() {
    if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/iPhone/i)) {
        return true
    }
    return false
}

restoreNotes()
init()