import React, { Component } from "react";

class Infinite extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.observer = null;
  }

  componentDidMount() {
    this.init();
  }

  init = () => {
    // 观察者创建
    this.observer = new IntersectionObserver(this.callback, options);
    // 观察列表第一个以及最后一个元素
    this.observer.observe(this.firstItem);
    this.observer.observe(this.lastItem);
  };

  callback = entries => {
    entries.forEach(entry => {
      if (entry.target.id === firstItemId) {
        // 当第一个元素进入视窗
      } else if (entry.target.id === lastItemId) {
        // 当最后一个元素进入视窗
      }
    });
  };



  render() {
    return <div>懒加载</div>;
  }
}

export default Infinite;
