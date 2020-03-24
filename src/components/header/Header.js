// require('styles/header.css');
import "../../styles/header.css";
import React from "react";

class Header extends React.Component {
  componentDidMount() {
    var input = document.createElement("input");
    input.type = "file";
    input.addEventListener("change", function() {
      console.log("111");
      alert(111);
    });

    document.getElementById("input").appendChild(input);
  }
  fileChange = () => {
    alert();
  };
  render() {
    return (
      <div className="header">
        <div>
          <h1>这是我页面的头部</h1>
        </div>

        <div id="input"> </div>

        {/* <input type="file" onChange={this.fileChange} />> */}
      </div>
    );
  }
}

export default Header;
