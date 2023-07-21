document.addEventListener('DOMContentLoaded', function () {
  var todoInput = document.getElementById('todoInput');
  var addButton = document.getElementById('addButton');
  var todoList = document.getElementById('todoList');

  loadTodoItems();

  addButton.addEventListener('click', function () {
    addTodoItem();
  });

  todoInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      addTodoItem();
    }
  });

  function loadTodoItems() {
    chrome.storage.local.get('todoItems', function (data) {
      var savedItems = data.todoItems;
      if (savedItems && savedItems.length > 0) {
        savedItems.forEach(function (itemText) {
          addTodoItem(itemText);
        });
      }
    });
  }

  function addTodoItem(text) {
    var todoText = text || todoInput.value;
    if (todoText) {
      var listItem = document.createElement('li');
      listItem.textContent = todoText;
      listItem.addEventListener('click', function () {
        this.classList.toggle('completed');
        updateTodoItems();
      });

      var deleteButton = document.createElement('button');
      deleteButton.textContent = 'حذف';
      deleteButton.className = 'delete-button';
      deleteButton.addEventListener('click', function (event) {
        event.stopPropagation();
        todoList.removeChild(listItem);
        updateTodoItems();
      });

      listItem.appendChild(deleteButton);
      todoList.appendChild(listItem);
      updateTodoItems();

      todoInput.value = '';
    }
  }

  function updateTodoItems() {
    var todoItems = [];
    var listItems = document.querySelectorAll('#todoList li');
    listItems.forEach(function (item) {
      todoItems.push(item.textContent);
    });
    chrome.storage.local.set({ 'todoItems': todoItems });
  }
});
