import { PureComponent } from "react";
import { ContextType } from "./Sticky";
export default class Container extends PureComponent {
    static childContextTypes: ContextType;
    getChildContext(): ContextType;
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
