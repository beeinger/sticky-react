import { Component } from "react";
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
export declare const ContextTypes: ContextType;
export interface ContextType {
    subscribe: Function;
    unsubscribe: Function;
    getParent: Function;
}
export default class Sticky extends Component<StickyProps, StickyState> {
    static defaultProps: Partial<StickyProps>;
    static contextTypes: ContextType;
    state: StickyState;
    placeholder: HTMLDivElement | null;
    content: Element | null;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(): void;
    handleContainerEvent: ({ distanceFromTop, distanceFromBottom, eventSource, }: {
        distanceFromTop: number;
        distanceFromBottom: number;
        eventSource: any;
    }) => void;
    render(): JSX.Element;
}
export {};
