"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _every = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/every"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _some = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/some"));

var _awaitAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/awaitAsyncGenerator"));

var _wrapAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/wrapAsyncGenerator"));

var _ResolverUtils = require("found/lib/ResolverUtils");

var _isPromise = _interopRequireDefault(require("is-promise"));

var _isEqual = _interopRequireDefault(require("lodash/isEqual"));

var _react = _interopRequireDefault(require("react"));

var _warning = _interopRequireDefault(require("warning"));

var _QuerySubscription = _interopRequireDefault(require("./QuerySubscription"));

var _ReadyStateRenderer = _interopRequireDefault(require("./ReadyStateRenderer"));

var _renderElement = _interopRequireDefault(require("./renderElement"));

var Resolver = /*#__PURE__*/function () {
  function Resolver(environment) {
    this.environment = environment;
    this.lastQuerySubscriptions = [];
  }

  var _proto = Resolver.prototype;

  _proto.resolveElements = function resolveElements(match) {
    var _this = this;

    return (0, _wrapAsyncGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var routeMatches, Components, queries, cacheConfigs, fetchPolicies, routeVariables, querySubscriptions, fetches, earlyComponents, earlyData, fetchedComponents, pendingElements;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              routeMatches = (0, _ResolverUtils.getRouteMatches)(match);
              Components = (0, _ResolverUtils.getComponents)(routeMatches);
              queries = (0, _ResolverUtils.getRouteValues)(routeMatches, function (route) {
                return route.getQuery;
              }, function (route) {
                return route.query;
              });
              cacheConfigs = (0, _ResolverUtils.getRouteValues)(routeMatches, function (route) {
                return route.getCacheConfig;
              }, function (route) {
                return route.cacheConfig;
              });
              fetchPolicies = (0, _ResolverUtils.getRouteValues)(routeMatches, function (route) {
                return route.getFetchPolicy;
              }, function (route) {
                return route.fetchPolicy;
              });
              process.env.NODE_ENV !== "production" ? (0, _warning["default"])(!(0, _some["default"])(routeMatches).call(routeMatches, function (_ref) {
                var route = _ref.route;
                return route.dataFrom;
              }), '`dataFrom` on routes no longer has any effect; use `fetchPolicy` instead.') : void 0;
              process.env.NODE_ENV !== "production" ? (0, _warning["default"])(!(0, _some["default"])(routeMatches).call(routeMatches, function (_ref2) {
                var route = _ref2.route;
                return route.getDataFrom;
              }), '`getDataFrom` on routes no longer has any effect; use `getFetchPolicy` instead.') : void 0;
              routeVariables = _this.getRouteVariables(match, routeMatches);
              querySubscriptions = _this.updateQuerySubscriptions(queries, routeVariables, cacheConfigs, fetchPolicies);
              fetches = (0, _map["default"])(querySubscriptions).call(querySubscriptions, function (querySubscription) {
                return querySubscription && querySubscription.fetch();
              });

              if (!(0, _some["default"])(Components).call(Components, _isPromise["default"])) {
                _context.next = 16;
                break;
              }

              _context.next = 13;
              return (0, _awaitAsyncGenerator2["default"])(_promise["default"].all((0, _map["default"])(Components).call(Components, _ResolverUtils.checkResolved)));

            case 13:
              _context.t0 = _context.sent;
              _context.next = 17;
              break;

            case 16:
              _context.t0 = Components;

            case 17:
              earlyComponents = _context.t0;
              _context.next = 20;
              return (0, _awaitAsyncGenerator2["default"])(_promise["default"].all((0, _map["default"])(fetches).call(fetches, _ResolverUtils.checkResolved)));

            case 20:
              earlyData = _context.sent;

              if (!(!(0, _every["default"])(earlyComponents).call(earlyComponents, _ResolverUtils.isResolved) || !(0, _every["default"])(earlyData).call(earlyData, _ResolverUtils.isResolved))) {
                _context.next = 32;
                break;
              }

              pendingElements = _this.createElements(routeMatches, earlyComponents, querySubscriptions, false);
              _context.next = 25;
              return (0, _every["default"])(pendingElements).call(pendingElements, function (element) {
                return element !== undefined;
              }) ? pendingElements : undefined;

            case 25:
              _context.next = 27;
              return (0, _awaitAsyncGenerator2["default"])(_promise["default"].all(Components));

            case 27:
              fetchedComponents = _context.sent;
              _context.next = 30;
              return (0, _awaitAsyncGenerator2["default"])(_promise["default"].all(fetches));

            case 30:
              _context.next = 33;
              break;

            case 32:
              fetchedComponents = earlyComponents;

            case 33:
              _context.next = 35;
              return _this.createElements(routeMatches, fetchedComponents, querySubscriptions, routeVariables, true);

            case 35:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  };

  _proto.getRouteVariables = function getRouteVariables(match, routeMatches) {
    return (0, _ResolverUtils.accumulateRouteValues)(routeMatches, match.routeIndices, function (variables, routeMatch) {
      var route = routeMatch.route,
          routeParams = routeMatch.routeParams; // We need to always run this to make sure we don't miss route params.

      var nextVariables = (0, _extends2["default"])({}, variables, {}, routeParams);

      if (route.prepareVariables) {
        nextVariables = route.prepareVariables(nextVariables, routeMatch);
      }

      return nextVariables;
    }, null);
  };

  _proto.updateQuerySubscriptions = function updateQuerySubscriptions(queries, routeVariables, cacheConfigs, fetchPolicies) {
    var _this2 = this,
        _context2,
        _context3;

    var querySubscriptions = (0, _map["default"])(queries).call(queries, function (query, i) {
      if (!query) {
        return null;
      }

      var variables = routeVariables[i];
      var lastQuerySubscription = _this2.lastQuerySubscriptions[i]; // Match the logic in <QueryRenderer> for not refetching.

      if (lastQuerySubscription && lastQuerySubscription.query === query && (0, _isEqual["default"])(lastQuerySubscription.variables, variables)) {
        _this2.lastQuerySubscriptions[i] = null;
        return lastQuerySubscription;
      }

      return new _QuerySubscription["default"]({
        environment: _this2.environment,
        query: query,
        variables: variables,
        cacheConfig: cacheConfigs[i],
        fetchPolicy: fetchPolicies[i]
      });
    });
    (0, _forEach["default"])(_context2 = this.lastQuerySubscriptions).call(_context2, function (querySubscription) {
      if (querySubscription) {
        querySubscription.dispose();
      }
    });
    this.lastQuerySubscriptions = (0, _concat["default"])(_context3 = []).call(_context3, querySubscriptions);
    return querySubscriptions;
  };

  _proto.createElements = function createElements(routeMatches, Components, querySubscriptions, routeVariables, fetched) {
    return (0, _map["default"])(routeMatches).call(routeMatches, function (match, i) {
      var route = match.route,
          router = match.router;
      var Component = Components[i];
      var querySubscription = querySubscriptions[i];
      var isComponentResolved = (0, _ResolverUtils.isResolved)(Component); // Handle non-Relay routes.

      if (!querySubscription) {
        if (route.render) {
          return route.render({
            match: match,
            Component: isComponentResolved ? Component : null,
            props: match,
            variables: routeVariables[i]
          });
        }

        if (!isComponentResolved) {
          return undefined;
        }

        return Component ? _react["default"].createElement(Component, {
          match: match,
          router: router
        }) : null;
      }

      var resolvedComponent = isComponentResolved ? Component : null;
      var hasComponent = Component != null;
      var element = (0, _renderElement["default"])({
        match: match,
        Component: resolvedComponent,
        isComponentResolved: isComponentResolved,
        hasComponent: hasComponent,
        querySubscription: querySubscription,
        resolving: true
      });

      if (!element) {
        return element;
      }

      return function (routeChildren) {
        return _react["default"].createElement(_ReadyStateRenderer["default"], {
          match: match,
          Component: resolvedComponent,
          isComponentResolved: isComponentResolved,
          hasComponent: hasComponent,
          element: element,
          routeChildren: routeChildren,
          querySubscription: querySubscription,
          fetched: fetched
        });
      };
    });
  };

  return Resolver;
}();

exports["default"] = Resolver;
module.exports = exports.default;