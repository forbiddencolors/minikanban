import {
  decorate,
  observable,
  extendObservable,
  computed,
  action,
  configure,
  set
} from "mobx";

//configure({enforceActions: 'always'})

class kanbanStore {
  tasks: [];
  text: "";
  input_hide: true;
  category: "";

  removeTask = name => {
    set(this, {
      tasks: this.tasks.filter(el => el.name !== name)
    });
  };

  activateInput = (e, cat) => {
    set(this, {
      input_hide: false,
      category: cat,
      text: ""
    });
  };

  prepareCard = ev => {
    set(this, {
      text: ev.target.value,
      input_hide: false,
      category: ev.target.attributes["category"].value
    });
  };

  createCard = ev => {
    if (!this.text.trim()) {
      this.input_hide = true;
      return;
    }

    let nextItems = this.tasks.concat([
      {
        id: Date.now(),
        name: this.text,
        category: this.category
      }
    ]);

    set(this, {
      tasks: nextItems,
      text: "",
      input_hide: true
    });
  };

  moveCard = (ev, cat) => {
    let id = ev.dataTransfer.getData("id");

    let tasks = this.tasks.filter(task => {
      if (task.name === id) {
        task.category = cat;
      }
      return task;
    });

    set(this, {
      ...this,
      tasks
    });
  };

  editCard = (ev, origName) => {
    set(this, {
      text: ev.target.value,
      input_hide: true,
      category: ev.target.attributes["category"].value
    });

    let updateIndex = this.tasks.findIndex(task => task.name === origName);

    let updatedTasks = this.tasks.map((task, i) => {
      if (i === updateIndex) {
        task.name = ev.target.value;
      }

      return task;
    });

    set(this, { tasks: updatedTasks });
  };
}

decorate(kanbanStore, {
  tasks: observable,
  text: observable,
  loggedIn: observable,
  input_hide: observable,
  category: observable,
  removeTask: action,
  activateInput: action,
  prepareCard: action,
  createCard: action,
  movecard: action,
  editCard: action
});

export default new kanbanStore();
