import React, { Component } from "react";
import { Button } from "antd";
import "./index.css";

class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosed: 1
    };
  }

  handleChose = chosed => {
    this.setState({
      chosed
    });
  };

  render() {
    const { chosed } = this.state;
    return (
      <div>
        <Button onClick={this.handleChose.bind(this, 1)}>loading1 </Button>
        <Button onClick={this.handleChose.bind(this, 2)}>loading2 </Button>

        {chosed === 1 && (
          <div className="bigbox">
            <div className="box"></div>
            <div className="box"></div>
            <div className="box"></div>
            <div className="box"></div>
            <div className="box"></div>
            <div className="box"></div>
            <div className="box"></div>
            <p>LOADING...</p>
          </div>
        )}

        {chosed === 2 && <div className="simple-spinner"></div>}
      </div>
    );
  }
}

export default Loading;
