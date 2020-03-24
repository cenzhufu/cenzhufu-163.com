import React, { Component, lazy, Suspense } from "react";

export default class RegularChildComponent extends Component {
  render() {
    console.log("Regular Component Rendered....");

    return (
      <div>
        <div>这是一个常规组件</div>

        <div>{`父组件传递过来的props ${this.props.name}`}</div>
      </div>
    );
  }
}
