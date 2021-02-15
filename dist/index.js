'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var raf = require('raf');
var ReactDOM = require('react-dom');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var raf__default = /*#__PURE__*/_interopDefaultLegacy(raf);
var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var Container = /** @class */ (function (_super) {
    __extends(Container, _super);
    function Container() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rafHandle = null;
        _this.events = [
            "resize",
            "scroll",
            "touchstart",
            "touchmove",
            "touchend",
            "pageshow",
            "load",
        ];
        _this.subscribers = [];
        _this.subscribe = function (handler) {
            _this.subscribers = _this.subscribers.concat([handler]);
        };
        _this.unsubscribe = function (handler) {
            _this.subscribers = _this.subscribers.filter(function (current) { return current !== handler; });
        };
        _this.notifySubscribers = function (evt) {
            if (!_this.framePending) {
                var currentTarget_1 = evt.currentTarget;
                _this.rafHandle = raf__default['default'](function () {
                    var _a;
                    _this.framePending = false;
                    var _b = ((_a = _this.node) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect()) || {}, top = _b.top, bottom = _b.bottom;
                    _this.subscribers.forEach(function (handler) {
                        return handler({
                            distanceFromTop: top,
                            distanceFromBottom: bottom,
                            eventSource: currentTarget_1 === window ? document.body : _this.node,
                        });
                    });
                });
                _this.framePending = true;
            }
        };
        _this.getParent = function () { return _this.node; };
        return _this;
    }
    Container.prototype.getChildContext = function () {
        return {
            subscribe: this.subscribe,
            unsubscribe: this.unsubscribe,
            getParent: this.getParent,
        };
    };
    Container.prototype.componentDidMount = function () {
        var _this = this;
        this.events.forEach(function (event) {
            return window.addEventListener(event, _this.notifySubscribers);
        });
    };
    Container.prototype.componentWillUnmount = function () {
        var _this = this;
        if (this.rafHandle) {
            raf__default['default'].cancel(this.rafHandle);
            this.rafHandle = null;
        }
        this.events.forEach(function (event) {
            return window.removeEventListener(event, _this.notifySubscribers);
        });
    };
    Container.prototype.render = function () {
        var _this = this;
        return (React__default['default'].createElement("div", __assign({}, this.props, { ref: function (node) { return (_this.node = node); }, onScroll: this.notifySubscribers, onTouchStart: this.notifySubscribers, onTouchMove: this.notifySubscribers, onTouchEnd: this.notifySubscribers })));
    };
    Container.childContextTypes = {
        subscribe: Function,
        unsubscribe: Function,
        getParent: Function,
    };
    return Container;
}(React.PureComponent));

var ContextTypes = {
    subscribe: function () { },
    unsubscribe: function () { },
    getParent: function () { },
};
var Sticky = /** @class */ (function (_super) {
    __extends(Sticky, _super);
    function Sticky() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isSticky: false,
            wasSticky: false,
            style: {},
        };
        _this.handleContainerEvent = function (_a) {
            var _b, _c, _d;
            var distanceFromTop = _a.distanceFromTop, distanceFromBottom = _a.distanceFromBottom, eventSource = _a.eventSource;
            var parent = _this.context.getParent();
            var preventingStickyStateChanges = false;
            if (_this.props.relative) {
                preventingStickyStateChanges = eventSource !== parent;
                distanceFromTop =
                    -(eventSource.scrollTop + eventSource.offsetTop) +
                        (((_b = _this.placeholder) === null || _b === void 0 ? void 0 : _b.offsetTop) || 0);
            }
            var placeholderClientRect = (_c = _this.placeholder) === null || _c === void 0 ? void 0 : _c.getBoundingClientRect();
            var contentClientRect = (_d = _this.content) === null || _d === void 0 ? void 0 : _d.getBoundingClientRect();
            var calculatedHeight = (contentClientRect === null || contentClientRect === void 0 ? void 0 : contentClientRect.height) || 0;
            var bottomDifference = distanceFromBottom - _this.props.bottomOffset - calculatedHeight;
            var wasSticky = !!_this.state.isSticky;
            var isSticky = preventingStickyStateChanges
                ? wasSticky
                : distanceFromTop <= -_this.props.topOffset &&
                    distanceFromBottom > -_this.props.bottomOffset;
            distanceFromBottom =
                (_this.props.relative
                    ? parent.scrollHeight - parent.scrollTop
                    : distanceFromBottom) - calculatedHeight;
            var style = !isSticky
                ? {}
                : {
                    position: "fixed",
                    top: bottomDifference > 0
                        ? _this.props.relative
                            ? parent.offsetTop - parent.offsetParent.scrollTop
                            : 0
                        : bottomDifference,
                    left: (placeholderClientRect === null || placeholderClientRect === void 0 ? void 0 : placeholderClientRect.left) || 0,
                    width: (placeholderClientRect === null || placeholderClientRect === void 0 ? void 0 : placeholderClientRect.width) || 0,
                };
            if (!_this.props.disableHardwareAcceleration) {
                style.transform = "translateZ(0)";
            }
            _this.setState({
                isSticky: isSticky,
                wasSticky: wasSticky,
                distanceFromTop: distanceFromTop,
                distanceFromBottom: distanceFromBottom,
                calculatedHeight: calculatedHeight,
                style: style,
            });
        };
        return _this;
    }
    Sticky.prototype.componentDidMount = function () {
        if (!this.context.subscribe)
            throw new TypeError("Expected Sticky to be mounted within StickyContainer");
        this.context.subscribe(this.handleContainerEvent);
    };
    Sticky.prototype.componentWillUnmount = function () {
        this.context.unsubscribe(this.handleContainerEvent);
    };
    Sticky.prototype.componentDidUpdate = function () {
        if (!this.placeholder)
            return;
        this.placeholder.style.paddingBottom = String(this.props.disableCompensation
            ? 0
            : (this.state.isSticky ? this.state.calculatedHeight : 0) + "px");
    };
    Sticky.prototype.render = function () {
        var _this = this;
        var element = React__default['default'].cloneElement(this.props.children({
            isSticky: this.state.isSticky,
            wasSticky: this.state.wasSticky,
            distanceFromTop: this.state.distanceFromTop,
            distanceFromBottom: this.state.distanceFromBottom,
            calculatedHeight: this.state.calculatedHeight,
            style: this.state.style,
        }), {
            ref: function (content) {
                _this.content = ReactDOM__default['default'].findDOMNode(content);
            },
        });
        return (React__default['default'].createElement("div", null,
            React__default['default'].createElement("div", { ref: function (placeholder) { return (_this.placeholder = placeholder); } }),
            element));
    };
    Sticky.defaultProps = {
        relative: false,
        topOffset: 0,
        bottomOffset: 0,
        disableCompensation: false,
        disableHardwareAcceleration: false,
    };
    Sticky.contextTypes = ContextTypes;
    return Sticky;
}(React.Component));

exports.StickyContainer = Container;
exports.default = Sticky;
//# sourceMappingURL=index.js.map
