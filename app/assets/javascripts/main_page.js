
    const app = {

    count: 0,

    init: function() {
      this.setBackgroundSize();
      this.addTodo.addTodoClickEvent();
    },

    setBackgroundSize: function() {
        const clientHeight = document.documentElement.clientHeight;
        document.body.style.minHeight = clientHeight - 20 + 'px';

        this.addBackgroundResizeEvent();
    },

    addBackgroundResizeEvent: function() {
      window.addEventListener('resize', function() {
        const clientHeight = document.documentElement.clientHeight;
        const clientWidth = document.documentElement.clientWidth;
        document.body.style.minHeight = clientHeight - 20 + 'px';
        document.body.style.minWidth = clientWidth + 'px';
      });
    },

    isMobile: function() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    isEmpty: function(obj) {
      for (var key in obj) {
        return false;
      }
      return true;
    },

    addTodo: {
      tasks: {},

      id: function() {
        return app.count;
      },

      add: function() {
        const items = app.addTodo.create();
        app.addTodo.setTextIcons(items);
        app.addTodo.setClass(items);
        app.addTodo.setAttributes(items);
        app.addTodo.addMouseEvents(items);
        return app.addTodo.append(items);
      },

      create: function() {
        return {
          'wrapper': document.createElement('div'),
          'navigation': document.createElement('div'),
          'titleBlock': document.createElement('div'),
          'calendarIconBlock': document.createElement('div'),
          'editIconBlock': document.createElement('div'),
          'deleteIconBlock': document.createElement('div'),
          'calendarIcon': document.createElement('i'),
          'editIcon': document.createElement('i'),
          'deleteIcon': document.createElement('i'),

          'createTaskBlock': document.createElement('div'),
          'addIconBlock': document.createElement('div'),
          'addIcon': document.createElement('i'),
          'formBlock': document.createElement('div'),
          'form': document.createElement('form'),
          'input': document.createElement('input'),
          'addTaskButton': document.createElement('button'),
          'inputTitle': document.createElement('input'),

          'taskList': document.createElement('div'),
          'alertBox': document.createElement('div'),
        }
      },

      setClass: function(obj) {
          for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
              obj[key].classList.add(key);
            }
          }
      },

      append: function(obj) {
        const { calendarIconBlock, calendarIcon, editIconBlock,
                editIcon, deleteIconBlock, deleteIcon, titleBlock,
                inputTitle, navigation, addIconBlock, addIcon,
                form, input, addTaskButton, formBlock,
                createTaskBlock, wrapper, taskList } = obj;

        calendarIconBlock.appendChild(calendarIcon);
        editIconBlock.appendChild(editIcon);
        deleteIconBlock.appendChild(deleteIcon);

        titleBlock.appendChild(calendarIconBlock);
        titleBlock.appendChild(inputTitle);
        titleBlock.appendChild(editIconBlock);
        titleBlock.appendChild(deleteIconBlock);

        navigation.appendChild(titleBlock);

        addIconBlock.appendChild(addIcon);

        form.appendChild(input);
        form.appendChild(addTaskButton);
        formBlock.appendChild(form);

        createTaskBlock.appendChild(addIconBlock);
        createTaskBlock.appendChild(formBlock);

        //taskList.appendChild(alertBox);

        wrapper.appendChild(navigation);
        wrapper.appendChild(createTaskBlock);
        wrapper.appendChild(taskList);

        return wrapper;
      },

      setTextIcons: function(obj) {
        const { calendarIcon, editIcon, deleteIcon, addIcon } = obj;
        calendarIcon.className = 'far fa-calendar-alt fa-lg';
        editIcon.className = 'fas fa-pencil-alt fa-ms';
        deleteIcon.className = 'far fa-trash-alt fa-ms';
        addIcon.className = 'fas fa-plus fa-msg';
      },

      setAttributes: function(obj) {
        const { wrapper, inputTitle, input, addTaskButton,
                editIconBlock, deleteIconBlock } = obj;

        wrapper.setAttribute('id', this.id());
        inputTitle.setAttribute('type', 'text');
        inputTitle.setAttribute('placeholder', 'Input title...');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'Start typing here to create a task...');
        addTaskButton.textContent = 'Add Task';
        if (!app.isMobile) {
          editIconBlock.style.opacity = '0';
          deleteIconBlock.style.opacity = '0';
        }
      },

      addTodoClickEvent: function() {
        const button = document.querySelector('.add-todo');
        const todoList = document.querySelector('.todo-list');

        button.addEventListener('click', function() {
          app.count++;
          const todo = app.addTodo.add();
          button.style.visibility = 'hidden';
          todoList.appendChild(todo);
          const title = app.addTodo.title.createTitle(todo);
          const input = app.addTodo.title.addEnterEvent(todo);
          app.addTodo.title.addBlurEvent(todo, title);
          app.addTodo.title.addEditEvent(todo, title, input);
          app.addTodo.addDeleteEvent(todo, todoList, title);
        });
      },

      title: {
        addEnterEvent: function(todo) {
          const input = todo.querySelector('.inputTitle');

          input.addEventListener('keyup', function(evt) {
            if (evt.keyCode == 13) {
              input.blur();
            }
          });
          return input;
        },

        addBlurEvent: function(todo, title) {
          const input = todo.querySelector('.inputTitle');
          const titleBlock = todo.querySelector('.titleBlock');
          const editIconBlock = todo.querySelector('.editIconBlock');
          const button = document.querySelector('.add-todo');

          input.addEventListener('blur', function() {
            if (input.value.replace(/\s/g,"") === '') {
              if (title.textContent == '') {
                input.classList.add('inputTitle-danger');
                input.focus();
                return;
              }
              input.value = title.textContent;
            } else {
              title.textContent = input.value;
            }
            try {
              input.classList.remove('inputTitle-danger');
            } catch(e) {}
            titleBlock.removeChild(input);
            titleBlock.insertBefore(title, editIconBlock);
            app.addTodo.toggleVisibilityIcons(titleBlock);
            button.style.visibility = 'visible';
          });
        },

        addEditEvent: function(todo, title, input) {
          const editIcon = todo.querySelector('.editIcon');
          const editIconBlock = todo.querySelector('.editIconBlock');
          const titleBlock = todo.querySelector('.titleBlock');

          editIcon.addEventListener('click', function() {
            titleBlock.removeChild(title);
            titleBlock.insertBefore(input, editIconBlock);
            app.addTodo.toggleVisibilityIcons(titleBlock);
            input.focus();
          });
        },

        createTitle: function(todo) {
          const title = document.createElement('span');
          const input = todo.querySelector('.inputTitle');
          const titleBlock = todo.querySelector('.titleBlock');

          title.classList.add('title');
          app.addTodo.toggleVisibilityIcons(titleBlock);
          input.focus();
          return title;
        }
      },

      addDeleteEvent: function(todo, todoList, title) {
        const deleteIcon = todo.querySelector('.deleteIcon');

        deleteIcon.addEventListener('click', function() {
          if (confirm('Вы уверены, что хотите удалить проект ' + title.textContent + '?')) {
            todoList.removeChild(todo);
          }
        });
      },

      toggleVisibilityIcons: function(todo) {
          const editIcon = todo.querySelector('.editIcon');
          const deleteIcon = todo.querySelector('.deleteIcon');
          if (editIcon.style.visibility == 'hidden' && deleteIcon.style.visibility == 'hidden') {
            editIcon.style.visibility = 'visible';
            deleteIcon.style.visibility = 'visible';
          } else {
            editIcon.style.visibility = 'hidden';
            deleteIcon.style.visibility = 'hidden';
          }
      },

      addMouseEvents: function(todo) {
        const { navigation, addTaskButton,
                editIconBlock, deleteIconBlock, taskList, input } = todo;

        navigation.addEventListener('mouseenter', function() {
          editIconBlock.style.opacity = '1';
          deleteIconBlock.style.opacity = '1';
        });
        navigation.addEventListener('mouseleave', function() {
          editIconBlock.style.opacity = '0';
          deleteIconBlock.style.opacity = '0';
        });

        addTaskButton.addEventListener('click', function(evt) {
          evt.preventDefault();
          if (input.value === '') {
            input.classList.add('input-danger');
            setTimeout(function() {
              input.classList.remove('input-danger');
            }, 2000);
            input.focus();
            return;
          }
          const task = app.addTodo.addTask.add(input.value);
          const taskInput = app.addTodo.addTask.addtaskInput(input.value);
          const taskText = app.addTodo.addTask.addEditEvent(task, taskInput);

          app.addTodo.addTask.addBlurEvent(task, taskInput, taskText);
          app.addTodo.addTask.addEnterEvent(taskInput);
          app.addTodo.addTask.addDeleteEvent(task, taskList);
          app.addTodo.addTask.addCheckboxEvent(task, taskList);
          taskList.appendChild(task);
          input.value = '';
        });
      },

      addTask: {
        add: function(title) {
          const items = this.create(title);
          this.setTextIcons(items);
          this.setClass(items);
          this.setAttributes(items);
          return this.append(items);
        },

        create: function(title) {
          const todo = {
            'task': document.createElement('div'),
            'clearfix': document.createElement('div'),
            'checkBoxBlock': document.createElement('div'),
            'checkBox': document.createElement('input'),
            'taskTextBlock': document.createElement('div'),
            'taskText': document.createElement('span'),
            'toolsBlock': document.createElement('div'),
            'arrowsIconBlock': document.createElement('div'),
            'arrowTop': document.createElement('div'),
            'arrowDown': document.createElement('div'),
            'taskEditIconBlock': document.createElement('div'),
            'taskDeleteIconBlock': document.createElement('div'),
            'taskEditIcon': document.createElement('i'),
            'taskDeleteIcon': document.createElement('i')
          };
          todo.taskText.textContent = title;
          return todo;
        },

        setClass: function(obj) {
          for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
              obj[key].classList.add(key);
            }
          }
        },

        setTextIcons: function(obj) {
          const { taskEditIcon, taskDeleteIcon } = obj;

          taskEditIcon.className = 'fas fa-pencil-alt fa-ms';
          taskDeleteIcon.className = 'far fa-trash-alt fa-ms';
        },

        setAttributes: function(obj) {
          const { checkBox, toolsBlock } = obj;

          checkBox.setAttribute('type', 'checkbox');
          toolsBlock.style.visibility = 'visible';
        },

        append: function(obj) {
          const { task, clearfix, checkBoxBlock, checkBox,
                  taskTextBlock, toolsBlock, taskText,
                  arrowsIconBlock, arrowTop, arrowDown,
                  taskEditIconBlock, taskDeleteIconBlock,
                  taskEditIcon, taskDeleteIcon } = obj;

          checkBoxBlock.appendChild(clearfix);
          checkBoxBlock.appendChild(checkBox);
          taskTextBlock.appendChild(taskText);
          arrowsIconBlock.appendChild(arrowTop);
          arrowsIconBlock.appendChild(arrowDown);
          taskEditIconBlock.appendChild(taskEditIcon);
          taskDeleteIconBlock.appendChild(taskDeleteIcon);
          toolsBlock.appendChild(arrowsIconBlock);
          toolsBlock.appendChild(taskEditIconBlock);
          toolsBlock.appendChild(taskDeleteIconBlock);
          task.appendChild(checkBoxBlock);
          task.appendChild(taskTextBlock);
          task.appendChild(toolsBlock);

          return task;
        },

        toggleVisibilityIcons: function(task) {
          const toolsBlock = task.querySelector('.toolsBlock');
          if (toolsBlock.style.visibility === 'hidden') {
            toolsBlock.style.visibility = 'visible';
          } else {
            toolsBlock.style.visibility = 'hidden';
          }
        },

        addEnterEvent: function(taskInput) {
          taskInput.addEventListener('keyup', function(evt) {
            if (evt.keyCode == 13) {
              taskInput.blur();
            }
          });
        },

        addBlurEvent: function(task, taskInput, taskText) {
          const taskTextBlock = task.querySelector('.taskTextBlock');
          taskInput.addEventListener('blur', function() {
            if (taskInput.value.replace(/\s/g,"") === '') {
              taskInput.value = taskText.textContent;
            } else {
              taskText.textContent = taskInput.value;
            }
            taskTextBlock.removeChild(taskInput);
            taskTextBlock.appendChild(taskText);
            app.addTodo.addTask.toggleVisibilityIcons(task);
          });
        },

        addEditEvent: function(task, input) {
          const editIcon = task.querySelector('.taskEditIcon');
          const taskTextBlock = task.querySelector('.taskTextBlock');
          const taskText = task.querySelector('.taskText');

          editIcon.addEventListener('click', function() {
            taskTextBlock.removeChild(taskText);
            taskTextBlock.appendChild(input);
            app.addTodo.addTask.toggleVisibilityIcons(task);
            input.focus();
          });
          return taskText;
        },

        addCheckboxEvent: function(task) {
          const checkBox = task.querySelector('.checkBox');
          const taskText = task.querySelector('.taskText');

          checkBox.addEventListener('change', function() {
            if (checkBox.checked) {
              taskText.classList.add('taskText-done');
            } else {
              try {
                taskText.classList.remove('taskText-done');
              } catch(e) {}
            }
          })
        },

        addtaskInput: function(title) {
          const input = document.createElement('input');
          input.setAttribute('type', 'text');
          input.classList.add('taskInput');
          input.value = title;

          return input;
        },

        addDeleteEvent: function(task, taskList) {
          const deleteIcon = task.querySelector('.taskDeleteIcon');

          deleteIcon.addEventListener('click', function() {
              taskList.removeChild(task);
          });
        }
      }
    }
  }
      //alertBox.classList.add('alertBox');
      //alertBox.textContent = 'The are no tasks here.';
      app.init();
