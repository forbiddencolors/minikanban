import React, { Component } from 'react';

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
      <ol style={{listStyle: 'lower-greek'}}>
        {this.props.items.map(createItem)}
      </ol>
    );
  }
}

export class TodoApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [
        {id: 1, text: 'item 1', created_at: '2018-11-19'},
        {id: 2, text: 'item 2', created_at: '2016-11-18'}
      ],
      text: '',
      input_empty: false
    }
  }
  onChange = (ev) => {
    this.setState({
      text: ev.target.value,
      input_empty: !ev.target.value.trim()
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
    this.setState({items: nextItems, text: ''});
  };
  render() {
    return (
      <div className='container'>
        <h3 className='display-1'>Todo</h3>
        <TodoList items={this.state.items} />
        <form onSubmit={this.handleSubmit} className={this.state.input_empty ? "form-inline has-danger" : "form-inline"}>
          <div className={'form-group'}>
            <input onChange={this.onChange} value={this.state.text} className='form-control' />
            {' '}
            <button className='btn btn-primary-outline'>
              {'Add #' + (this.state.items.length + 1)}
            </button>
          </div>
        </form>
      </div>
    );
  }
}




