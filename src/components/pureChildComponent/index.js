import React, { Component } from "react";
import PureChildComponent from "./pureChildComponent";
import RegularChildComponent from "./RegularChildComponent ";

export default class componentName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Eric",
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        name: "Eric",
      });
    }, 2000);
  }

  render() {
    const { name } = this.state;
    console.log("statr_name", name);

    return (
      <div>
        这是一个父组件
        <PureChildComponent name={name} />
        <RegularChildComponent name={name} />
      </div>
    );
  }
}
