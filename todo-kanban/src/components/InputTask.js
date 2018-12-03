import React, { Component } from "react";

export class InputTask extends Component {
  propTypes: {
    value: React.PropTypes.string,
    onChange: React.PropTypes.func
  };

  ["focus_" + this.props.category]: ?HTMLInputElement;

  componentDidUpdate(prevProps, prevState) {
    if (this.props.category === this.props.taskType) {
      this["focus_" + this.props.category].focus();
    }
  }

  changeHandler = e => {
    e.preventDefault();
    console.log("calling change", e);
    if (typeof this.props.onChange === "function") {
      this.props.onChange(e);
    }
  };

  submitHandler = e => {
    e.preventDefault();
    console.log("calling submit", e);
    if (typeof this.props.onSubmit === "function") {
      this.props.onSubmit(e);
    }
    this["focus_" + this.props.category].value = "";
  };

  render() {
    let createTask =
      !this.props.activate && this.props.category === this.props.taskType;

    return (
      <div>
        <form
          onSubmit={this.submitHandler}
          className={
            createTask
              ? `form-inline add--${this.props.taskType}`
              : "form-inline"
          }
        >
          <div className={"form-group"}>
            <input
              onChange={this.changeHandler}
              category={this.props.category}
              id={"create_" + this.props.taskType}
              ref={c => (this["focus_" + this.props.category] = c)}
              defaultValue=""
              className="form-control"
            />{" "}
          </div>
        </form>
      </div>
    );
  }
}
