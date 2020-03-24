import React from "react";
// import LimitedInfiniteScroll from "react-limited-infinite-scroll";
import data from "../main/data";

// const { total, list } = this.props.data

class MyScroll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
    };
  }
  componentDidMount() {
    // this._getData();
  }

  _getData = () => {
    this.setState({
      dataList: [...this.state.dataList, ...data.data],
    });
  };
  loadNextFunc = () => {
    this._getData();
  };
  render() {
    const { dataList } = this.state;
    console.log("-------------", dataList);
    const items = dataList.map((item, index) => {
      return (
        <div
          key={index}
          style={{
            display: "inline-block",
          }}
        >
          <h3>{item.face.gender}</h3>
          <div style={{ width: "120px", height: "120px" }}>
            <img src={item.face.file} />
          </div>
        </div>
      );
    });
    return (
      <div>fadsfa</div>
      // <LimitedInfiniteScroll
      //   // limit={5}
      //   hasMore={items.length < 1000}
      //   spinLoader={<div className="loader">Loading...</div>}
      //   mannualLoader={
      //     <span
      //       style={{
      //         fontSize: 20,
      //         lineHeight: 1.5,
      //         marginTop: 20,
      //         marginBottom: 20,
      //         display: "inline-block",
      //       }}
      //     >
      //       Load More
      //     </span>
      //   }
      //   noMore={
      //     <div style={{ textAlign: "center" }} className="loader">
      //       No More Items
      //     </div>
      //   }
      //   loadNext={this.loadNextFunc}
      //   threshold={50}
      // >
      //   {items}
      // </LimitedInfiniteScroll>
    );
  }
}

export default MyScroll;
