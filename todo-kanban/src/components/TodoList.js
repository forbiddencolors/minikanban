import React, { Component } from 'react';
import '../styles/TodoList.css';

export class TodoList extends React.Component {
  render() {
    let createItem = (item) => {
      return (
        <li key={item.id}>
          {item.text}
        </li>
      )
    };

    return (
      <ul className="list--tasks">
        {this.props.items.map(createItem)}
      </ul>
    );
  }
}

export class TodoApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [
        {id: 1, text: 'item 1 longer', created_at: '2018-11-19'},
        {id: 2, text: 'item 2 longer description', created_at: '2016-11-18'}
      ],
      text: '',
      input_empty: true
    }
  }
  onChange = (ev) => {
    this.setState({
      text: ev.target.value,
      input_empty: !ev.target.value.trim()
    });
  };
  showAdd = (ev) => {
    this.setState({
      input_empty: false
    });
  };
  handleSubmit = (ev) => {
      ev.preventDefault();
      if (!this.state.text.trim()) {
        this.setState({input_empty: true});
        return;
    }
    
    var nextItems = this.state.items.concat([{
      id: Date.now(),
      text: this.state.text,
      created_at: new Date()
    }]);
    this.setState({items: nextItems, text: '', input_empty: true});
  };
  render() {
    return (
      <div className='list--container'>
        <div className="list--header">
          <div className="list--title">To-Do</div>
          <div className="list--add" onClick={this.showAdd} ></div>
        </div>
        
        <form onSubmit={this.handleSubmit} className={this.state.input_empty ? "form-inline has-danger" : "form-inline"}>
          <div className={'form-group'}>
            <input onChange={this.onChange} value={this.state.text} className='form-control' />
            {' '}
          </div>
        </form>
        <TodoList items={this.state.items} />
      </div>
    );
  }
}




