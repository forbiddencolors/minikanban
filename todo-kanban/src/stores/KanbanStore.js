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
    console.log("running");
    set(this, {
      input_hide: false,
      category: cat,
      text: ""
    });
  };
}

decorate(kanbanStore, {
  tasks: observable,
  text: observable,
  loggedIn: observable,
  input_hide: observable,
  category: observable,
  removeTask: action,
  activateInput: action
});

export default new kanbanStore();
