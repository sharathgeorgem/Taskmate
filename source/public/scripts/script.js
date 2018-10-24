getTasksFromAPI((tasks) => {
  tasks.map((item) => {
    addItemToDOM(item, item.completed)
  })
})

// Event listener for button press
document.getElementById('add').addEventListener('click', function () {
  var value = document.getElementById('item').value
  if (value) {
    addItemToDOM({taskName: value})
    document.getElementById('item').value = ''
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
  document.getElementById('item').value = ''
  sendItemToAPI(value, (item) => {
    console.log('The item is ', item)
    addItemToDOM(item)
  })
}

// To remove list item
function removeItem () {
  var item = this.parentNode.parentNode
  var parent = item.parentNode
  var id = parent.id
  var value = item.innerText
  parent.removeChild(item)
}
// To switch tasks between To-do/Completed task list
function completeItem () {
  var item = this.parentNode.parentNode
  var parent = item.parentNode
  var id = parent.id
  var value = item.innerText
  // Check if item should be added to completed list or re-added to todo list
  var target = (id === 'todo') ? document.getElementById('completed') : document.getElementById('todo')
  parent.removeChild(item)
  target.insertBefore(item, target.childNodes[0])
}
// Edit text
function editText () {
  var item = this.parentNode.parentNode
  var id = item.parentNode.id
  var buttons = this.parentNode
  var editInput = item.querySelector('input')
  var commentInput = item.querySelector('textArea')
  if (editInput.style.display === 'none') {
    editInput.style.display = 'block'
    editInput.value = item.innerText
  } else {
    if (editInput.value && (editInput.value !== item.innerText)) {
      if (id === 'todo') {
        let flip = data.todo.find(o => o.taskName === item.innerText)
        data.todo.splice(data.todo.indexOf(flip), 1, {taskName: editInput.value})
      } else {
        let flip = data.completed.find(o => o.taskName === item.innerText)
        data.completed.splice(data.completed.indexOf(flip), 1, {taskName: editInput.value})
      }
      item.innerText = editInput.value
      item.appendChild(editInput)
      item.appendChild(commentInput)
      item.appendChild(buttons)
    }
    editInput.style.display = 'none'
  }
}
// Comment text
function commentText () {
  var item = this.parentNode.parentNode
  var id = item.parentNode.id
  var buttons = this.parentNode
  var editInput = item.querySelector('input')
  var commentInput = item.querySelector('textArea')
  if (commentInput.style.display === 'none') { // Check for hidden
    commentInput.style.display = 'block'
    if (id === 'todo') {
      let flip = data.todo.find(o => o.taskName === item.innerText)
      if (commentInput.value) {
        flip.commentText = commentInput.value
      }
    } else {
      let flip = data.completed.find(o => o.taskName === item.innerText)
      if (commentInput.value) {
        flip.commentText = commentInput.value
      }
    }
    item.appendChild(editInput)
    item.appendChild(commentInput)
    item.appendChild(buttons)
  } else {
    if (id === 'todo') {
      let flip = data.todo.find(o => o.taskName === item.innerText)
      if (commentInput.value) {
        flip.commentText = commentInput.value
      }
    } else {
      let flip = data.completed.find(o => o.taskName === item.innerText)
      if (commentInput.value) {
        flip.commentText = commentInput.value
      }
    }
    item.appendChild(editInput)
    item.appendChild(commentInput)
    item.appendChild(buttons)
    commentInput.style.display = 'none'
  }
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
  item.innerText = obj.description
  item.setAttribute('data-id', obj.id)

  var editArea = document.createElement('input')
  editArea.setAttribute('type', 'text')
  editArea.classList.add('editArea')
  var commentArea = document.createElement('textarea')
  commentArea.setAttribute('placeholder', 'Comments.')
  commentArea.classList.add('textArea')
  if (obj.commentText) {
    commentArea.innerText = obj.commentText
  }
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
  // Add click event for editing task name
  var edit = document.createElement('button')
  edit.classList.add('edit')
  edit.addEventListener('click', editText)
  // Add click event for adding comment
  var comment = document.createElement('button')
  comment.classList.add('comment')
  comment.addEventListener('click', commentText)

  item.appendChild(editArea)
  item.appendChild(commentArea)
  buttons.appendChild(remove)
  buttons.appendChild(edit)
  buttons.appendChild(comment)
  buttons.appendChild(voice)
  buttons.appendChild(complete)

  item.appendChild(buttons)
  list.insertBefore(item, list.childNodes[0])
}

// Send task data to API
function sendItemToAPI (item, func) {
  fetch('/add', {
    method: 'POST',
    body: JSON.stringify({taskName: item}),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
    .then((response) => {
      console.log('Success:', JSON.stringify(response))
      if (func) {
        func(response)
      }
    })
    .catch(error => console.error('Error:', error))
}

function getTasksFromAPI (func) {
  fetch('/tasks')
    .then(res => res.json())
    .then((response) => {
      if (func) {
        func(response)
      }
    })
    .catch(error => console.error('Error:', error))
}
