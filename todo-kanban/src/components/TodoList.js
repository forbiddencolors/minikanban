import React, { Component } from "react";
import { InputTask } from "./InputTask";
import "../styles/TodoList.css";
import { observable } from "mobx";
import { AsyncTrunk } from "mobx-sync";

export class TodoApp extends Component {
  state = {
    tasks: [
      { name: "Write Novel", category: "wip", id: "0" },
      { name: "Go Running", category: "wip", id: "1" },
      { name: "Learn React", category: "complete", id: "2" },
      { name: "Update Kanban Board", category: "backlog", id: "3" }
    ],
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
    }); // this is synchronous
  }

  onChange = ev => {
    ev.preventDefault();
    console.log("parent change", ev.target.value);
    this.setState({
      text: ev.target.value,
      input_empty: false,
      category: ev.target.attributes["category"].value
    });
  };

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

  showAdd = (e, cat) => {
    this.setState({
      input_empty: false,
      category: cat,
      text: ""
    });
  };

  handleSubmit = ev => {
    ev.preventDefault();
    if (!this.state.text.trim()) {
      this.setState({ input_empty: true });
      return;
    }

    var nextItems = this.state.tasks.concat([
      {
        id: Date.now(),
        name: this.state.text,
        category: this.state.category
      }
    ]);
    this.setState({ tasks: nextItems, text: "", input_empty: true });
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

    this.state.tasks.forEach((t, i) => {
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
              category={this.state.category}
              taskType="backlog"
              activate={this.state.input_empty}
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
              category={this.state.category}
              taskType="wip"
              activate={this.state.input_empty}
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
              category={this.state.category}
              taskType="complete"
              activate={this.state.input_empty}
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
