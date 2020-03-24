import React from "react";
import ReactList from "react-list";
import Data from "./data";
import "./a.css";
class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ataList: [],
    };

    this.handleScroll = this.handleScroll.bind(this);
  }

  componentWillMount() {
    this.setState({
      dataList: Data.data,
    });
    console.log("----", Data.data.face);
  }

  // handleAccounts(accounts) {
  //   this.setState({accounts});
  // }

  renderItem(index, key) {
    return (
      <div key={key} className="a">
        <h4>{this.state.dataList[index].face.id}</h4>
      </div>
    );
  }

  handleScroll = () => {
    // const {
    //   hasMore
    // } = this.state;
    // if (!hasMore) {
    //   return;
    // }
    //下面是判断页面滚动到底部的逻辑
    if (
      this.scrollDom.scrollTop + this.scrollDom.clientHeight >=
      this.scrollDom.scrollHeight
    ) {
      console.log({
        a: this.scrollDom.scrollTop,
        b: this.scrollDom.clientHeight,
        c: this.scrollDom.scrollHeight,
      });
      this.setState({
        dataList: [...this.state.dataList, ...Data.data],
      });
    }
  };
  render() {
    return (
      <div className="main">
        <h4>这是页面中部</h4>

        <div
          style={{
            overflow: "auto",
            maxHeight: 400,
            border: "10px solid #38afd4",
          }}
          ref={body => (this.scrollDom = body)}
          onScroll={this.handleScroll}
        >
          <ReactList
            itemRenderer={::this.renderItem}
            useTranslate3d={true}
            length={this.state.dataList.length}
            type="uniform"
          />
        </div>
      </div>
    );
  }
}

export default Main;
