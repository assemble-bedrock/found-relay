"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = renderElement;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _warning = _interopRequireDefault(require("warning"));

function renderElement(_ref) {
  var match = _ref.match,
      Component = _ref.Component,
      isComponentResolved = _ref.isComponentResolved,
      hasComponent = _ref.hasComponent,
      querySubscription = _ref.querySubscription,
      resolving = _ref.resolving;
  var route = match.route,
      router = match.router;
  var readyState = querySubscription.readyState,
      environment = querySubscription.environment,
      variables = querySubscription.variables;
  var error = readyState.error,
      props = readyState.props;

  if (!route.render) {
    if (!isComponentResolved || !error && !props) {
      return undefined;
    }

    if (!props || !hasComponent) {
      process.env.NODE_ENV !== "production" ? (0, _warning["default"])(hasComponent, 'Route with query `%s` has no render method or component.', querySubscription.getQueryName()) : void 0;
      return null;
    }

    return _react["default"].createElement(Component, (0, _extends2["default"])({
      match: match,
      router: router
    }, props));
  }

  return route.render((0, _extends2["default"])({}, readyState, {
    match: match,
    Component: isComponentResolved ? Component : null,
    props: props && (0, _extends2["default"])({
      match: match,
      router: router
    }, props),
    environment: environment,
    variables: variables,
    resolving: resolving
  }));
}

module.exports = exports.default;