// Global object to store app data
var data = (window.localStorage.getItem('todoList')) ? JSON.parse(window.localStorage.getItem('todoList')) : {
  // Array of todo task objects
  todo: [],
  // Array of completed task objects
  completed: []
}
renderTodoList()
// Event listener for button press
document.getElementById('add').addEventListener('click', function () {
  var value = document.getElementById('item').value
  if (value) {
    addItemToDOM({taskName: value})
    document.getElementById('item').value = ''
    data.todo.push({taskName: value})
    console.log(data)
    dataObjectUpdated()
  }
})
// Event listener for Enter key press
document.getElementById('item').addEventListener('keydown', function (e) {
  var value = this.value
  if (e.code === 'Enter' && value) {
    addItem(value)
  }
})
function addItem (value) {
  addItemToDOM({taskName: value})
  document.getElementById('item').value = ''
  // sendItemToAPI(value)
  data.todo.push({taskName: value})
  dataObjectUpdated()
}
// To restore saved tasks
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
// Save task to local storage
function dataObjectUpdated () {
  window.localStorage.setItem('todoList', JSON.stringify(data))
}
// To remove list item
function removeItem () {
  var item = this.parentNode.parentNode
  var parent = item.parentNode
  var id = parent.id
  var value = item.innerText
  var findIndexInTodo = data.todo.indexOf(data.todo.find(o => o.taskName === value))
  var findIndexInCompleted = data.completed.indexOf(data.completed.find(o => o.taskName === value))
  if (id === 'todo') {
    data.todo.splice(findIndexInTodo, 1)
  } else {
    data.completed.splice(findIndexInCompleted, 1)
  }
  parent.removeChild(item)
  dataObjectUpdated()
}
// To switch tasks between To-do/Completed task list
function completeItem () {
  var item = this.parentNode.parentNode
  var parent = item.parentNode
  var id = parent.id
  var value = item.innerText
  if (id === 'todo') {
    let flip = data.todo.find(o => o.taskName === value)
    data.todo.splice(data.todo.indexOf(flip), 1)
    data.completed.push(flip)
  } else {
    let flip = data.completed.find(o => o.taskName === value)
    data.completed.splice(data.completed.indexOf(flip), 1)
    data.todo.push(flip)
  }
  // Check if item should be added to completed list or re-added to todo list
  var target = (id === 'todo') ? document.getElementById('completed') : document.getElementById('todo')
  parent.removeChild(item)
  target.insertBefore(item, target.childNodes[0])
  dataObjectUpdated()
}
// Text to speech converter
function textToSpeech () {
  var utterance = new window.SpeechSynthesisUtterance()
  utterance.lang = 'en-GB'
  var item = this.parentNode.parentNode
  var inputText = item.innerText
  utterance.text = inputText
  window.speechSynthesis.speak(utterance)
}
// Adds a new item to the todo list
function addItemToDOM (obj, completed) {
  var list = (completed) ? document.getElementById('completed') : document.getElementById('todo')
  var item = document.createElement('li')
  item.innerText = obj.taskName
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

// Send task data to API
function sendItemToAPI (item) {
  var req = new XMLHttpRequest()
  req.open('POST', '/add')
  req.setRequestHeader('Content-Type', 'application/json')
  req.send(JSON.stringify({item: item}))

  req.addEventListener('load', () => {
    // console.log(req.responseText)
    console.log('Request done')
  })

  req.addEventListener('error', () => {
    console.log('Something happened bruh')
  })
}
