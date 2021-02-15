import { PureComponent } from "react";
export default class Container extends PureComponent {
    static childContextTypes: {
        subscribe: FunctionConstructor;
        unsubscribe: FunctionConstructor;
        getParent: FunctionConstructor;
    };
    getChildContext(): {
        subscribe: (handler: Function) => void;
        unsubscribe: (handler: Function) => void;
        getParent: () => HTMLDivElement | null;
    };
    node: HTMLDivElement | null;
    framePending: boolean;
    rafHandle: number | null;
    events: string[];
    subscribers: Function[];
    subscribe: (handler: Function) => void;
    unsubscribe: (handler: Function) => void;
    notifySubscribers: EventListenerOrEventListenerObject;
    getParent: () => HTMLDivElement | null;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
