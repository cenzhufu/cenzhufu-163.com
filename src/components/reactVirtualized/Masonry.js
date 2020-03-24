import React, { Component } from "react";
import {
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry
} from "react-virtualized";
import Data from "../mockData";

export default class MasonryIni extends Component {
  constructor(props) {
    super(props);

    this.cache = new CellMeasurerCache({
      defaultHeight: 250, //默认item高度
      defaultWidth: 200, //默认ite宽度
      fixedWidth: true
    });

    // this.createMasonryItem = {
    //   cellMeasurerCache: this.cache,
    //   columnCount: Math.floor(
    //     (window.innerWidth - 30) / (40 + this.cache.defaultWidth)
    //   ), //  一行item的个数
    //   columnWidth: 200, //item之间左右间距
    //   spacer: 40, //item之间上下间距
    // };

    this.cellPositioner = createMasonryCellPositioner({
      cellMeasurerCache: this.cache,
      columnCount: Math.floor(
        (window.innerWidth - 30) / (40 + this.cache.defaultWidth)
      ), //  一行item的个数
      columnWidth: 200, //item之间左右间距
      spacer: 40 //item之间上下间距
    });

    this.state = {
      list: []
      // columnCount: 4, //  一行item的个数
      // cellPositioner: createMasonryCellPositioner(this.createMasonryItem),
    };
  }

  componentDidMount() {
    this.setState({
      list: Data.data
    });
    // window.addEventListener("resize", this.resizeCell);
  }

  // resizeCell = () => {
  //   const windowHeight = window.innerHeight;
  //   const windowWidth = window.innerWidth;
  //   const columnCount = Math.floor(
  //     (windowWidth - 30) /
  //       (this.createMasonryItem.spacer + this.cache.defaultWidth)
  //   );
  //   this.setState({
  //     cellPositioner: createMasonryCellPositioner({
  //       ...this.createMasonryItem,
  //       ...columnCount,
  //     }),
  //   });

  //   console.log({ windowHeight, columnCount });
  // };

  cellRenderer = ({ index, key, parent, style }) => {
    const { list } = this.state;
    return (
      <CellMeasurer cache={this.cache} index={index} key={key} parent={parent}>
        <div style={style}>
          <div
            style={{
              // height: datum.imageHeight || "260px",
              // width: datum.imageWidth || "240px",
              textAlign: "center",
              lineHeight: "260px",
              background: "gray"
            }}
          >
            {index}
          </div>
        </div>
      </CellMeasurer>
    );
  };

  onScroll = ({ scrollHeight, clientHeight, scrollTop }) => {
    if (scrollTop + clientHeight >= scrollHeight) {
      const { list } = this.state;
      this.setState({
        list: [...list, ...Data.data]
      });
    }
  };

  render() {
    const { list } = this.state;

    return (
      <div
        style={{
          // overflow: "auto",
          // maxHeight: 400,
          border: "2px solid black"
        }}
        ref={body => (this.scrollDom = body)}
        onScroll={this.handleScroll}
      >
        <Masonry
          id="masonry"
          cellCount={list.length}
          cellMeasurerCache={this.cache}
          cellPositioner={this.cellPositioner}
          cellRenderer={this.cellRenderer}
          onScroll={this.onScroll}
          // style={{ border: "1px solid red" }}
          height={600}
          width={1900}
          style={{ width: "100%", display: "flex" }}
        />
      </div>
    );
  }
}
