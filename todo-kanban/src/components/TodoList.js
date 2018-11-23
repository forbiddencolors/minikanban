import React, { Component } from 'react';
import '../styles/TodoList.css';


export class TodoApp extends Component {
    state = {
        tasks: [
          ],
          text: '',
          input_empty: true,
          category: ''
    }

  onChange = (ev, origName) => {
  
      this.setState({
        text: ev.target.value,
        input_empty: true,
        category: ev.target.attributes['category'].value
      });

      let updateIndex = this.state.tasks.findIndex(task => task.name === origName);

      let updatedTasks = this.state.tasks.map((task, i) => { 
          if (i === updateIndex) {
               task.name = this.state.text ;
           }

          return task    
        });


      this.setState({tasks: updatedTasks})
    }

  removeTask = (name) => {

    this.setState({
        tasks: this.state.tasks.filter(el => el.name !== name)
    })

  }

  showAdd = (e,cat) => {
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


        var nextItems = this.state.tasks.splice([{
    
      name: this.state.text,
      
    }]);
    this.setState({tasks: nextItems, text: '', input_empty: true});
    console.log('targetvalue:', ev.target)
  };


    onDragStart = (ev, id) => {
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
                     <form >
                        <input disabled type="text" defaultValue={t.name} onChange={(e) => this.onChange(e, t.name)} onBlur={ (e) => e.target.disabled = true} category={t.category} />
                     </form>
                     <div className="redX"  onClick={ (e)=>{ this.removeTask(t.name) }}><img src="redX.svg" /></div>
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




