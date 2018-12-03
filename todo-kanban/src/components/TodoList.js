import React, { Component } from "react";
import { InputTask } from "./InputTask";
import "../styles/TodoList.css";
import { observable, action, set } from "mobx";
import { observer } from "mobx-react";
import { AsyncTrunk } from "mobx-sync";

class TodoApp extends Component {
  state = {
    tasks: [],
    text: "",
    input_empty: true,
    category: ""
  };

  // init your stories
  kanbanStore = observable({
    tasks: [],
    text: "",
    input_empty: true,
    category: ""
  });

  componentDidMount() {
    const trunk = new AsyncTrunk(this.kanbanStore);
    trunk.init().then(() => {
      // do any staff with loaded store
      console.log("rehydrated", this.kanbanStore);
      this.kanbanStore.storeLoaded = true;
    }); // this is synchronous
  }

  onChange = action(ev => {
    ev.preventDefault();
    console.log("parent change", ev.target.value);
    this.kanbanStore.text = ev.target.value;
    this.kanbanStore.input_empty = false;
    this.kanbanStore.category = ev.target.attributes["category"].value;
    // this.setState({
    //   text: ev.target.value,
    //   input_empty: false,
    //   category: ev.target.attributes["category"].value
    // });
  });

  onUpdate = (ev, origName) => {
    this.setState({
      text: ev.target.value,
      input_empty: true,
      category: ev.target.attributes["category"].value
    });

    let updateIndex = this.state.tasks.findIndex(
      task => task.name === origName
    );

    let updatedTasks = this.state.tasks.map((task, i) => {
      if (i === updateIndex) {
        task.name = ev.target.value;
      }

      return task;
    });

    this.setState({ tasks: updatedTasks });
  };

  removeTask = name => {
    this.setState({
      tasks: this.state.tasks.filter(el => el.name !== name)
    });
  };

  showAdd = action((e, cat) => {
    console.log("running");
    set(this.kanbanStore, {
      input_empty: false,
      category: cat,
      text: ""
    });
  });

  handleSubmit = ev => {
    ev.preventDefault();
    if (!this.kanbanStore.text.trim()) {
      this.kanbanStore.input_empty = true;
      //this.setState({ input_empty: true });
      return;
    }

    var nextItems = this.kanbanStore.tasks.concat([
      {
        id: Date.now(),
        name: this.kanbanStore.text,
        category: this.kanbanStore.category
      }
    ]);
    set(this.kanbanStore, {
      tasks: nextItems,
      text: "",
      input_empty: true
    });
    //this.kanbanStore({ tasks: nextItems, text: "", input_empty: true });
  };

  onDragStart = (ev, id) => {
    console.log("dragstart:", id);
    ev.dataTransfer.setData("id", id);
  };

  onDragOver = ev => {
    ev.preventDefault();
  };

  onDrop = (ev, cat) => {
    let id = ev.dataTransfer.getData("id");

    let tasks = this.state.tasks.filter(task => {
      if (task.name === id) {
        task.category = cat;
      }
      return task;
    });

    this.setState({
      ...this.state,
      tasks
    });
  };

  _handleDoubleClickItem = event => {
    console.log(event.target.name);
    event.target.disabled = false;
  };

  render() {
    var tasks = {
      backlog: [],
      wip: [],
      complete: []
    };

    this.kanbanStore.tasks.forEach((t, i) => {
      tasks[t.category].push(
        <div
          onDragStart={e => this.onDragStart(e, t.name)}
          draggable
          className="draggable"
          type="text"
          key={i}
          onDoubleClick={e => this._handleDoubleClickItem(e)}
        >
          <input
            disabled
            type="text"
            defaultValue={t.name}
            onChange={e => this.onUpdate(e, t.name)}
            onBlur={e => (e.target.disabled = true)}
            category={t.category}
          />
          <div
            className="redX"
            onClick={e => {
              this.removeTask(t.name);
            }}
          >
            <img src="redX.svg" alt="Delete Button" />
          </div>
        </div>
      );
    });

    return (
      <div className="container-drag">
        <h2 className="header">(Mini)Kanban board</h2>
        <div className="kanbanBoard">
          <div
            className="backlog"
            onDragOver={e => this.onDragOver(e)}
            onDrop={e => {
              this.onDrop(e, "backlog");
            }}
          >
            <div className="list--header">
              <div className="list--title">To-Do</div>
              <div
                className="list--add"
                onClick={e => this.showAdd(e, "backlog")}
              />
            </div>

            <InputTask
              category={this.kanbanStore.category}
              taskType="backlog"
              activate={this.kanbanStore.input_empty}
              onChange={this.onChange}
              onSubmit={this.handleSubmit}
            />

            {tasks.backlog}
          </div>

          <div
            className="wip"
            onDragOver={e => this.onDragOver(e)}
            onDrop={e => {
              this.onDrop(e, "wip");
            }}
          >
            <div className="list--header">
              <div className="list--title">In-Progress</div>
              <div
                className="list--add"
                onClick={e => this.showAdd(e, "wip")}
              />
            </div>

            <InputTask
              category={this.kanbanStore.category}
              taskType="wip"
              activate={this.kanbanStore.input_empty}
              onChange={this.onChange}
              onSubmit={this.handleSubmit}
            />

            {tasks.wip}
          </div>

          <div
            className="complete"
            onDragOver={e => this.onDragOver(e)}
            onDrop={e => this.onDrop(e, "complete")}
          >
            <div className="list--header">
              <div className="list--title">Done</div>
              <div
                className="list--add"
                onClick={e => this.showAdd(e, "complete")}
              />
            </div>

            <InputTask
              category={this.kanbanStore.category}
              taskType="complete"
              activate={this.kanbanStore.input_empty}
              onChange={this.onChange}
              onSubmit={this.handleSubmit}
            />

            {tasks.complete}
          </div>
        </div>
      </div>
    );
  }
}

export default observer(TodoApp);
