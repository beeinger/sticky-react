import React, { PureComponent } from "react";

import { ContextTypes } from "./Sticky";
import raf from "raf";

export default class Container extends PureComponent {
  static childContextTypes = ContextTypes;

  getChildContext() {
    return {
      subscribe: this.subscribe,
      unsubscribe: this.unsubscribe,
      getParent: this.getParent,
    };
  }

  node: HTMLDivElement | null;
  framePending: boolean;
  rafHandle: number | null = null;
  events = [
    "resize",
    "scroll",
    "touchstart",
    "touchmove",
    "touchend",
    "pageshow",
    "load",
  ];
  subscribers: Function[] = [];

  subscribe = (handler: Function) => {
    this.subscribers = this.subscribers.concat([handler]);
  };

  unsubscribe = (handler: Function) => {
    this.subscribers = this.subscribers.filter(
      (current) => current !== handler
    );
  };

  notifySubscribers: EventListenerOrEventListenerObject = (evt) => {
    if (!this.framePending) {
      const { currentTarget } = evt;

      this.rafHandle = raf(() => {
        this.framePending = false;
        const { top, bottom } = this.node?.getBoundingClientRect() || {};

        this.subscribers.forEach((handler) =>
          handler({
            distanceFromTop: top,
            distanceFromBottom: bottom,
            eventSource: currentTarget === window ? document.body : this.node,
          })
        );
      });
      this.framePending = true;
    }
  };

  getParent = () => this.node;

  componentDidMount() {
    this.events.forEach((event) =>
      window.addEventListener(event, this.notifySubscribers)
    );
  }

  componentWillUnmount() {
    if (this.rafHandle) {
      raf.cancel(this.rafHandle);
      this.rafHandle = null;
    }

    this.events.forEach((event) =>
      window.removeEventListener(event, this.notifySubscribers)
    );
  }

  render() {
    return (
      <div
        {...this.props}
        ref={(node) => (this.node = node)}
        onScroll={
          (this.notifySubscribers as unknown) as React.UIEventHandler<
            HTMLDivElement
          >
        }
        onTouchStart={
          (this.notifySubscribers as unknown) as React.UIEventHandler<
            HTMLDivElement
          >
        }
        onTouchMove={
          (this.notifySubscribers as unknown) as React.UIEventHandler<
            HTMLDivElement
          >
        }
        onTouchEnd={
          (this.notifySubscribers as unknown) as React.UIEventHandler<
            HTMLDivElement
          >
        }
      />
    );
  }
}
