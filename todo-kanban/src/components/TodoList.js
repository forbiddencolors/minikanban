import React, { Component } from 'react';
import '../styles/TodoList.css';


export class TodoApp extends Component {
    state = {
        tasks: [
            {name:"Write Novel",category:"wip"},
            {name:"Clip Coupons", category:"wip"},
            {name:"Learn React", category:"complete"},
            {name:"Kanban", category:"backlog"}
          ],
          text: '',
          input_empty: true,
          category: ''
    }

    focus_backlog: ?HTMLInputElement;
    focus_wip: ?HTMLInputElement;
    focus_complete: ?HTMLInputElement;

    componentDidUpdate(prevProps, prevState) {
      if (this.state.category) {
        this['focus_' + this.state.category].focus();
      }
    }

    onChange = (ev) => {  
      console.log('before', ev.target.value)
      this.setState({
        text: ev.target.value,
        input_empty: false,
        category: ev.target.attributes['category'].value
      });
    };


    onUpdate = (ev, origName) => {

      console.log(ev.target.value);
      this.setState({
        text: ev.target.value,
        input_empty: true,
        category: ev.target.attributes['category'].value
      });

      let updateIndex = this.state.tasks.findIndex(task => task.name === origName);

      let updatedTasks = this.state.tasks.map((task, i) => { 
          if (i === updateIndex) {
               task.name = ev.target.value ;
           }

          return task    
        });


      this.setState({tasks: updatedTasks})
    }

  removeTask = (name) => {
    console.log(name)
    this.setState({
        tasks: this.state.tasks.filter(el => el.name !== name)
    })

  }

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
         if (task.name === id) {
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
                    onDoubleClick={(e) => this._handleDoubleClickItem(e)} > 
                  <input disabled type="text" defaultValue={t.name} onChange={(e) => this.onUpdate(e, t.name)} onBlur={ (e) => e.target.disabled = true} category={t.category} />
                     <div className="redX"  onClick={ (e)=>{ this.removeTask(t.name) }}><img src="redX.svg" alt="Delete Button" /></div>
                </div>
            );
        });

        let createCompleteTask = (!this.state.input_empty  && this.state.category ==='complete')
        let createWipTask = (!this.state.input_empty  && this.state.category ==='wip')
        let createBacklogTask = (!this.state.input_empty  && this.state.category ==='backlog')

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
                    <form onSubmit={this.handleSubmit} className={createBacklogTask ? "form-inline add--backlog" : "form-inline"}>
                      <div className={'form-group'}>
                        <input onChange={this.onChange}  category="backlog" id="create_backlog" ref={b => (this.focus_backlog = b)} defaultValue='' className='form-control' autoFocus={createBacklogTask } />
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
                        <form onSubmit={this.handleSubmit} className={createWipTask ? "form-inline add--wip" : "form-inline"}>
                          <div className={'form-group'}>
                            <input onKeyPress={this.onChange} category="wip" id="create_wip" ref={w => (this.focus_wip = w)} defaultValue='' className='form-control' autoFocus={createWipTask} />
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
                    <form onSubmit={this.handleSubmit} className={createCompleteTask ? "form-inline add--complete" : "form-inline"}>
                      <div className={'form-group'}>
                        <input onKeyPress={this.onChange} category="complete" id="create_complete" ref={c =>  (this.focus_complete = c)} defaultValue='' className='form-control' autoFocus={ createCompleteTask } />
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




