import React, { PureComponent } from "react";

class PureChildComponent extends PureComponent {
  render() {
    console.log(" Pure  Component rendered....");

    return (
      <div>
        <div>这是一个纯组件，可以根据传入的props是否改变进行渲染图</div>

        <div>{`父组件传递过来的props ${this.props.name}`}</div>
        <div
          style={{
            width: "200px",
            height: "100px",
            margin: "10px",
            border: "20px solid black",
            padding: "20px",
            background: "#fff"
            // padding: "24px"
            // border: "1px solid black"
          }}
        >
          {/* <div
            style={{
              display: "inline-block",
              width: "200px",
              height: "100px",
              background: "black"
              // padding: "24px",
            }}
            className="ie-box"
          >
            ie盒子
          </div>
          <div
            style={{
              display: "inline-block",
              width: "200px",
              height: "100px",
              background: "yellow"
              // padding: "24px",
            }}
            className="w3c-box"
          >
            w3c盒子
          </div> */}
        </div>
      </div>
    );
  }
}

export default PureChildComponent;
