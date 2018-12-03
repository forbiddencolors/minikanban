import React, { Component } from "react";
import "./styles/App.css";
import TodoApp from "./components/TodoList";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="kanban--board">
          <div className="kanban-columns todo">
            <TodoApp />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
