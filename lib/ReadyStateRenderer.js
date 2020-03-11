"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/objectWithoutPropertiesLoose"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inheritsLoose"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _reactRelay = require("react-relay");

var _warning = _interopRequireDefault(require("warning"));

var _QuerySubscription = _interopRequireDefault(require("./QuerySubscription"));

var _renderElement = _interopRequireDefault(require("./renderElement"));

var hasOwnProperty = Object.prototype.hasOwnProperty;
var propTypes = {
  match: _propTypes["default"].shape({
    route: _propTypes["default"].object.isRequired
  }).isRequired,
  Component: _propTypes["default"].elementType,
  isComponentResolved: _propTypes["default"].bool.isRequired,
  hasComponent: _propTypes["default"].bool.isRequired,
  element: _propTypes["default"].oneOfType([_propTypes["default"].element, _propTypes["default"].func]),
  routeChildren: _propTypes["default"].oneOfType([_propTypes["default"].object, _propTypes["default"].element]),
  querySubscription: _propTypes["default"].instanceOf(_QuerySubscription["default"]).isRequired,
  fetched: _propTypes["default"].bool.isRequired
};

var ReadyStateRenderer = /*#__PURE__*/function (_React$Component) {
  (0, _inheritsLoose2["default"])(ReadyStateRenderer, _React$Component);

  function ReadyStateRenderer(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.onUpdate = function () {
      if (!_this.props.fetched) {
        // Ignore subscription updates if our data aren't yet fetched. We'll
        // rerender anyway once fetching finishes.
        return;
      }

      var _this$props = _this.props,
          match = _this$props.match,
          Component = _this$props.Component,
          isComponentResolved = _this$props.isComponentResolved,
          hasComponent = _this$props.hasComponent,
          querySubscription = _this$props.querySubscription;
      var element = (0, _renderElement["default"])({
        match: match,
        Component: Component,
        isComponentResolved: isComponentResolved,
        hasComponent: hasComponent,
        querySubscription: querySubscription,
        resolving: false
      });

      _this.setState({
        element: element || null
      });
    };

    var _element = props.element,
        _querySubscription = props.querySubscription;
    _this.state = {
      isInitialRender: true,
      element: _element,
      propsElement: _element,
      querySubscription: _querySubscription,
      selectionReference: _querySubscription.retain(),
      onUpdate: _this.onUpdate
    };
    return _this;
  }

  var _proto = ReadyStateRenderer.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.props.querySubscription.subscribe(this.onUpdate);
  };

  ReadyStateRenderer.getDerivedStateFromProps = function getDerivedStateFromProps(_ref, state) {
    var element = _ref.element,
        querySubscription = _ref.querySubscription;

    if (state.isInitialRender) {
      return {
        isInitialRender: false
      };
    }

    var nextState = null;

    if (element !== state.propsElement) {
      nextState = {
        element: element,
        propsElement: element
      };
    }

    if (querySubscription !== state.querySubscription) {
      state.selectionReference.dispose();
      state.querySubscription.unsubscribe(state.onUpdate);
      nextState = nextState || {};
      nextState.querySubscription = querySubscription;
      nextState.selectionReference = querySubscription.retain();
      querySubscription.subscribe(state.onUpdate);
    }

    return nextState;
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.state.selectionReference.dispose();
    this.props.querySubscription.unsubscribe(this.onUpdate);
  };

  _proto.render = function render() {
    var element = this.state.element;

    if (!element) {
      return element;
    }

    var _this$props2 = this.props,
        _m = _this$props2.match,
        _C = _this$props2.Component,
        _iCR = _this$props2.isComponentResolved,
        _hC = _this$props2.hasComponent,
        _e = _this$props2.element,
        routeChildren = _this$props2.routeChildren,
        querySubscription = _this$props2.querySubscription,
        _f = _this$props2.fetched,
        ownProps = (0, _objectWithoutPropertiesLoose2["default"])(_this$props2, ["match", "Component", "isComponentResolved", "hasComponent", "element", "routeChildren", "querySubscription", "fetched"]);
    var relayProps = querySubscription.readyState.props;

    if (relayProps) {
      var _context;

      (0, _forEach["default"])(_context = (0, _keys["default"])(relayProps)).call(_context, function (relayPropName) {
        // At least on Node v8.x, it's slightly faster to guard the delete here
        // with this hasOwnProperty check.
        if (hasOwnProperty.call(ownProps, relayPropName)) {
          process.env.NODE_ENV !== "production" ? (0, _warning["default"])(false, 'Ignoring <ReadyStateRenderer> prop `%s` that shadows a Relay prop from its query `%s`. This is most likely due to its parent cloning it and adding extraneous Relay props.', relayPropName, querySubscription.getQueryName()) : void 0;
          delete ownProps[relayPropName];
        }
      });
    }

    return _react["default"].createElement(_reactRelay.ReactRelayContext.Provider, {
      value: querySubscription.relayContext
    }, typeof element === 'function' ? _react["default"].cloneElement(element(routeChildren), ownProps) : _react["default"].cloneElement(element, (0, _extends2["default"])({}, _react["default"].isValidElement(routeChildren) ? {
      children: routeChildren
    } : routeChildren, {}, ownProps)));
  };

  return ReadyStateRenderer;
}(_react["default"].Component);

ReadyStateRenderer.propTypes = propTypes;
var _default = ReadyStateRenderer;
exports["default"] = _default;
module.exports = exports.default;