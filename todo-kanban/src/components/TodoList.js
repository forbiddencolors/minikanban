import React, { Component } from "react";
import { InputTask } from "./InputTask";
import "../styles/TodoList.css";
import { observable, action, set } from "mobx";
import { observer } from "mobx-react";
import { AsyncTrunk } from "mobx-sync";
import kanbanStore from "../stores/KanbanStore";

class TodoApp extends Component {
  kanbanStore = observer(kanbanStore);

  componentDidMount() {
    const trunk = new AsyncTrunk(this.kanbanStore);
    trunk.init().then(() => {
      console.log("rehydrated", this.kanbanStore.tasks);
      this.kanbanStore.storeLoaded = true;
    });
  }

  onChange = ev => {
    ev.preventDefault();
    this.kanbanStore.prepareCard(ev);
  };

  onUpdate = (ev, origName) => {
    this.kanbanStore.editCard(ev, origName);
  };

  handleSubmit = ev => {
    ev.preventDefault();
    this.kanbanStore.createCard(ev);
  };

  onDragStart = (ev, id) => {
    ev.dataTransfer.setData("id", id);
  };

  onDragOver = ev => {
    ev.preventDefault();
  };

  onDrop = (ev, cat) => {
    this.kanbanStore.moveCard(ev, cat);
  };

  _handleDoubleClickItem = event => {
    console.log(event.target.name);
    event.target.disabled = false;
  };

  render() {
    console.log("whats in the store", this.kanbanStore.tasks);
    var tasks = {
      backlog: [],
      wip: [],
      complete: []
    };
    if (this.kanbanStore.tasks) {
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
                this.kanbanStore.removeTask(t.name);
              }}
            >
              <img src="redX.svg" alt="Delete Button" />
            </div>
          </div>
        );
      });
    }

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
                onClick={e => this.kanbanStore.activateInput(e, "backlog")}
              />
            </div>

            <InputTask
              category={this.kanbanStore.category}
              taskType="backlog"
              activate={this.kanbanStore.input_hide}
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
                onClick={e => this.kanbanStore.activateInput(e, "wip")}
              />
            </div>

            <InputTask
              category={this.kanbanStore.category}
              taskType="wip"
              activate={this.kanbanStore.input_hide}
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
                onClick={e => this.kanbanStore.activateInput(e, "complete")}
              />
            </div>

            <InputTask
              category={this.kanbanStore.category}
              taskType="complete"
              activate={this.kanbanStore.input_hide}
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
