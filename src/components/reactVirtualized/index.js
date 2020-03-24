import React, { Component } from "react";
import MasonryIni from "./Masonry";
import Infinite from "./infinite";
import { Button } from "antd";

// import List from "./List";
export default class reactVirtualized extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 1
    };
  }

  handleChange = val => {
    console.log(val);
    this.setState({
      selected: val
    });

    // this.setState({ selected: val });
  };

  handleSelect = val => {
    console.log("val", val);

    // this.setState({ selected: val });
  };

  render() {
    const { selected } = this.state;
    return (
      <div>
        <Button onClick={this.handleChange.bind(this, 1)}> Masonry组件</Button>
        <Button onClick={this.handleChange.bind(this, 2)}> Infinite组件</Button>

        {selected === 1 && <MasonryIni />}
        {selected === 2 && <Infinite />}
      </div>
    );
  }
}
