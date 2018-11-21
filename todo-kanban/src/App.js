import React, { Component } from 'react';
import './App.css';
import {TodoApp, TodoList} from './components/TodoList'

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>
          (Mini)Kanban board
        </h1>
        <div className="kanban--board">
          <div className="kanban-columns todo" >
            <TodoApp />
          </div>
          <div className="kanban-columns inprogress" />
          <div className="kanban-columns done" />
        </div>
      </div>
    );
  }
}

export default App;