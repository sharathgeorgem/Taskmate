var data = (window.localStorage.getItem('todoList')) ? JSON.parse(window.localStorage.getItem('todoList')) : {
  todo: [],
  completed: []
}

renderTodoList()

// When button is clicked
// Any text within the item field, add that text to the To-Do list
document.getElementById('add').addEventListener('click', function () {
  var value = document.getElementById('item').value
  if (value) {
    addItemToDOM(value)
    document.getElementById('item').value = ''

    data.todo.push(value)
    dataObjectUpdated()
  }
})

document.getElementById('item').addEventListener('keydown', function (e) {
  var value = this.value
  if (e.code === 'Enter' && value) {
    addItem(value)
  }
})

function addItem (value) {
  addItemToDOM(value)
  document.getElementById('item').value = ''
}

function renderTodoList () {
  if (!data.todo.length && !data.completed.length) return

  for (let i = 0; i < data.todo.length; i++) {
    let value = data.todo[i]
    addItemToDOM(value)
  }
  for (let i = 0; i < data.completed.length; i++) {
    let value = data.completed[i]
    addItemToDOM(value, true)
  }
}

function dataObjectUpdated () {
  window.localStorage.setItem('todoList', JSON.stringify(data))
}

function removeItem () {
  var item = this.parentNode.parentNode
  var parent = item.parentNode
  var id = parent.id
  var value = item.innerText

  if (id === 'todo') {
    data.todo.splice(data.todo.indexOf(value), 1)
  } else {
    data.completed.splice(data.completed.indexOf(value), 1)
  }
  parent.removeChild(item)
  dataObjectUpdated()
}

function completeItem () {
  var item = this.parentNode.parentNode
  var parent = item.parentNode
  var id = parent.id
  var value = item.innerText

  if (id === 'todo') {
    data.todo.splice(data.todo.indexOf(value), 1)
    data.completed.push(value)
  } else {
    data.completed.splice(data.completed.indexOf(value), 1)
    data.todo.push(value)
  }

  // Check if item should be added to completed list or re-added to todo list
  var target = (id === 'todo') ? document.getElementById('completed') : document.getElementById('todo')

  parent.removeChild(item)
  target.insertBefore(item, target.childNodes[0])
  dataObjectUpdated()
}

function textToSpeech () {
  var utterance = new window.SpeechSynthesisUtterance()
  utterance.lang = 'en-GB'
  var item = this.parentNode.parentNode
  var inputText = item.innerText
  utterance.text = inputText
  window.speechSynthesis.speak(utterance)
}

// Adds a new item to the todo list
function addItemToDOM (text, completed) {
  var list = (completed) ? document.getElementById('completed') : document.getElementById('todo')

  var item = document.createElement('li')
  item.innerText = text

  var buttons = document.createElement('div')
  buttons.classList.add('buttons')

  var remove = document.createElement('button')
  remove.classList.add('remove')

  // Add click event for removing item
  remove.addEventListener('click', removeItem)

  var complete = document.createElement('button')
  complete.classList.add('complete')

  // Add click event for completing item
  complete.addEventListener('click', completeItem)

  var voice = document.createElement('button')
  voice.classList.add('voice')

  // Add click event for speech output
  voice.addEventListener('click', textToSpeech)

  buttons.appendChild(remove)
  buttons.appendChild(voice)
  buttons.appendChild(complete)
  item.appendChild(buttons)

  list.insertBefore(item, list.childNodes[0])
}
