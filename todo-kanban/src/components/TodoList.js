import React, { Component } from 'react';
import '../styles/TodoList.css';


export class TodoApp extends Component {
    state = {
        tasks: [
            {name:"Learn Angular",category:"wip", bgcolor: ""},
            {name:"React", category:"wip", bgcolor:""},
            {name:"Vue", category:"complete", bgcolor:"skyblue"},
            {name:"Kanban", category:"backlog", bgcolor:"grey"}
          ],
          text: '',
          input_empty: true,
          category: ''
    }

    onChange = (ev) => {

        console.log('target',ev.target.value, !ev.target.value.trim(), ev.target.attributes['category'].value)

    this.setState({
      text: ev.target.value,
      input_empty: !ev.target.value.trim(),
      category: ev.target.attributes['category'].value
    });
  };
  showAdd = (e,cat) => {
    console.log(cat)
    this.setState({
      input_empty: false,
      category: cat,
      text:''
    });
  };
  handleSubmit = (ev) => {
      ev.preventDefault();
      console.log(ev)
      if (!this.state.text.trim()) {
        this.setState({input_empty: true});
        return;
        }

        var nextItems = this.state.tasks.concat([{
      id: Date.now(),
      name: this.state.text,
      category: this.state.category,
      bgcolor: "skyblue"
    }]);
    this.setState({tasks: nextItems, text: '', input_empty: true});
    console.log('targetvalue:', ev.target)
  };


    onDragStart = (ev, id) => {
        console.log('dragstart:',id);
        ev.dataTransfer.setData("id", id);
    }

    onDragOver = (ev) => {
        ev.preventDefault();
    }

    onDrop = (ev, cat) => {
       let id = ev.dataTransfer.getData("id");
       
       let tasks = this.state.tasks.filter((task) => {
           if (task.name == id) {
               task.category = cat;
           }
           return task;
       });

       this.setState({
           ...this.state,
           tasks
       });


    }

    _handleDoubleClickItem = (event) => {
        console.log(event.target.name)
        event.target.disabled=false;
    }

    render() {
        var tasks = {
            backlog: [],
            wip: [],
            complete: []
        }

        this.state.tasks.forEach ((t,i ) => {
            tasks[t.category].push(

                <div onDragStart = {(e) => this.onDragStart(e, t.name)}
                    draggable
                    className="draggable" 
                    type="text"
                    key={i}
                    onDoubleClick={(e) => this._handleDoubleClickItem(e)} 
                     >
                     <form onSubmit={this.handleSubmit}>
                        <input disabled type="text" defaultValue={t.name} onChange={this.onChange} category={t.category} />
                     </form>
                     </div>
            );
        });

        return (
            <div className="container-drag">

                <h2 className="header">(Mini)Kanban board</h2>
            <div className="kanbanBoard">
                <div className="backlog"
                    onDragOver={(e)=>this.onDragOver(e)}
                    onDrop={(e)=>{this.onDrop(e, "backlog")}}>
                    <div className="list--header">
                      <div className="list--title">To-Do</div>
                      <div className="list--add" onClick={(e)=>this.showAdd(e, 'backlog')} ></div>
                    </div>

                    <div>
                        <form onSubmit={this.handleSubmit} className={!this.state.input_empty && this.state.category ==='backlog' ? "form-inline add--backlog" : "form-inline"}>
                          <div className={'form-group'}>
                            <input onChange={this.onChange} category="backlog" defaultValue='' className='form-control' />
                            {' '}
                          </div>
                        </form>
                    </div>

                    {tasks.backlog}
                </div>

                <div className="wip"
                    onDragOver={(e)=>this.onDragOver(e)}
                    onDrop={(e)=>{this.onDrop(e, "wip")}}>
                    <div className="list--header">
                      <div className="list--title">In-Progress</div>
                      <div className="list--add" onClick={(e)=>this.showAdd(e, 'wip')} ></div>
                    </div>

                    <div>
                        <form onSubmit={this.handleSubmit} className={!this.state.input_empty && this.state.category ==='wip' ? "form-inline add--wip" : "form-inline"}>
                          <div className={'form-group'}>
                            <input onChange={this.onChange} category="wip" defaultValue={this.state.text} className='form-control' />
                            {' '}
                          </div>
                        </form>
                    </div>

                    {tasks.wip}
                </div>
                
                <div className="complete" 
                    onDragOver={(e)=>this.onDragOver(e)}
                    onDrop={(e)=>this.onDrop(e, "complete")}>
                     <div className="list--header">
                      <div className="list--title">Done</div>
                      <div className="list--add" onClick={(e)=>this.showAdd(e,'complete')} ></div>
                    </div>

                    <div>
                        <form onSubmit={this.handleSubmit} className={!this.state.input_empty  && this.state.category ==='complete'? "form-inline add--complete" : "form-inline"}>
                          <div className={'form-group'}>
                            <input onChange={this.onChange} category="complete" defaultValue={this.state.text} className='form-control' />
                            {' '}
                          </div>
                        </form>
                    </div>
                     {tasks.complete}
                </div>
            </div>


            </div>
        );
    }
}




