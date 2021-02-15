import React, { Component } from "react";

import ReactDOM from "react-dom";

interface StickyProps {
  topOffset: number;
  bottomOffset: number;
  relative: Boolean;
  children: (arg0: StickyState) => any;
  disableCompensation: Boolean;
  disableHardwareAcceleration: Boolean;
}

interface StickyState {
  isSticky: Boolean;
  wasSticky: Boolean;
  style: any;
  distanceFromTop?: number;
  distanceFromBottom?: number;
  calculatedHeight?: number;
}

export const ContextTypes = {
  subscribe: Function,
  unsubscribe: Function,
  getParent: Function,
};

export default class Sticky extends Component<StickyProps, StickyState> {
  static defaultProps: Partial<StickyProps> = {
    relative: false,
    topOffset: 0,
    bottomOffset: 0,
    disableCompensation: false,
    disableHardwareAcceleration: false,
  };

  static contextTypes = ContextTypes;

  state: StickyState = {
    isSticky: false,
    wasSticky: false,
    style: {},
  };

  placeholder: HTMLDivElement | null;
  content: Element | null;

  componentDidMount() {
    if (!this.context.subscribe)
      throw new TypeError(
        "Expected Sticky to be mounted within StickyContainer"
      );

    this.context.subscribe(this.handleContainerEvent);
  }

  componentWillUnmount() {
    this.context.unsubscribe(this.handleContainerEvent);
  }

  componentDidUpdate() {
    if (!this.placeholder) return;
    this.placeholder.style.paddingBottom = String(
      this.props.disableCompensation
        ? 0
        : `${this.state.isSticky ? this.state.calculatedHeight : 0}px`
    );
  }

  handleContainerEvent = ({
    distanceFromTop,
    distanceFromBottom,
    eventSource,
  }: {
    distanceFromTop: number;
    distanceFromBottom: number;
    eventSource: any;
  }) => {
    const parent = this.context.getParent();

    let preventingStickyStateChanges = false;
    if (this.props.relative) {
      preventingStickyStateChanges = eventSource !== parent;
      distanceFromTop =
        -(eventSource.scrollTop + eventSource.offsetTop) +
        (this.placeholder?.offsetTop || 0);
    }

    const placeholderClientRect = this.placeholder?.getBoundingClientRect();
    const contentClientRect = this.content?.getBoundingClientRect();
    const calculatedHeight = contentClientRect?.height || 0;

    const bottomDifference =
      distanceFromBottom - this.props.bottomOffset - calculatedHeight;

    const wasSticky = !!this.state.isSticky;
    const isSticky = preventingStickyStateChanges
      ? wasSticky
      : distanceFromTop <= -this.props.topOffset &&
        distanceFromBottom > -this.props.bottomOffset;

    distanceFromBottom =
      (this.props.relative
        ? parent.scrollHeight - parent.scrollTop
        : distanceFromBottom) - calculatedHeight;

    const style: Partial<{
      position: string;
      top: number;
      left: number;
      width: number;
      transform: string;
    }> = !isSticky
      ? {}
      : {
          position: "fixed",
          top:
            bottomDifference > 0
              ? this.props.relative
                ? parent.offsetTop - parent.offsetParent.scrollTop
                : 0
              : bottomDifference,
          left: placeholderClientRect?.left || 0,
          width: placeholderClientRect?.width || 0,
        };

    if (!this.props.disableHardwareAcceleration) {
      style.transform = "translateZ(0)";
    }

    this.setState({
      isSticky,
      wasSticky,
      distanceFromTop,
      distanceFromBottom,
      calculatedHeight,
      style,
    });
  };

  render() {
    const element = React.cloneElement(
      this.props.children({
        isSticky: this.state.isSticky,
        wasSticky: this.state.wasSticky,
        distanceFromTop: this.state.distanceFromTop,
        distanceFromBottom: this.state.distanceFromBottom,
        calculatedHeight: this.state.calculatedHeight,
        style: this.state.style,
      }),
      {
        ref: (content: React.ReactInstance | null | undefined) => {
          this.content = ReactDOM.findDOMNode(content) as Element;
        },
      }
    );

    return (
      <div>
        <div ref={(placeholder) => (this.placeholder = placeholder)} />
        {element}
      </div>
    );
  }
}
