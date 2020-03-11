"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _relayRuntime = require("relay-runtime");

var QuerySubscription = /*#__PURE__*/function () {
  function QuerySubscription(_ref) {
    var _this = this;

    var environment = _ref.environment,
        query = _ref.query,
        variables = _ref.variables,
        cacheConfig = _ref.cacheConfig,
        fetchPolicy = _ref.fetchPolicy;

    this.onChange = function (snapshot) {
      _this.updateReadyState({
        error: null,
        props: snapshot.data,
        retry: _this.retry
      });
    };

    this.retry = function () {
      _this.retrying = true;
      _this.retryingAfterError = !!_this.readyState.error;

      _this.dispose();

      _this.execute(function () {});
    };

    this.environment = environment;
    this.query = query;
    this.variables = variables;
    this.cacheConfig = cacheConfig;
    this.fetchPolicy = fetchPolicy;
    this.operation = (0, _relayRuntime.createOperationDescriptor)((0, _relayRuntime.getRequest)(query), variables);
    this.fetchPromise = null;
    this.selectionReference = null;
    this.pendingRequest = null;
    this.rootSubscription = null;
    this.retrying = false;
    this.retryingAfterError = false;
    this.readyState = {
      error: null,
      props: null,
      retry: null
    };
    this.listeners = [];
    this.relayContext = {
      environment: this.environment,
      variables: this.operation.request.variables
    };
  }

  var _proto = QuerySubscription.prototype;

  _proto.fetch = function fetch() {
    var _this2 = this;

    if (!this.fetchPromise) {
      this.fetchPromise = new _promise["default"](function (resolve) {
        _this2.execute(resolve);
      });
    }

    return this.fetchPromise;
  };

  _proto.execute = function execute(resolve) {
    var _this3 = this;

    var snapshot;
    this.selectionReference = this.retain();

    var onSnapshot = function onSnapshot() {
      if (snapshot) {
        return;
      }

      snapshot = _this3.environment.lookup(_this3.operation.fragment, _this3.operation);

      _this3.onChange(snapshot);

      _this3.rootSubscription = _this3.environment.subscribe(snapshot, _this3.onChange);
      resolve();
    };

    var onError = function onError(error) {
      _this3.updateReadyState({
        error: error,
        props: null,
        retry: _this3.retry
      });

      resolve();
    };

    var useStoreSnapshot = !this.retrying && (this.fetchPolicy === 'store-and-network' || this.fetchPolicy === 'store-or-network') && this.environment.check(this.operation).status === 'available';

    if (!(this.fetchPolicy === 'store-or-network' && useStoreSnapshot)) {
      try {
        this.pendingRequest = this.environment.execute({
          operation: this.operation,
          cacheConfig: this.cacheConfig
        })["finally"](function () {
          _this3.pendingRequest = null;
        }).subscribe({
          next: onSnapshot,
          error: onError
        });
      } catch (error) {
        onError(error);
        return;
      }
    } // Only use the store snapshot if the network layer doesn't synchronously
    // resolve a snapshot, to match <QueryRenderer>.


    if (!snapshot && useStoreSnapshot) {
      onSnapshot();
    }

    if (!snapshot && this.retryingAfterError) {
      this.updateReadyState({
        error: null,
        props: null,
        retry: null
      });
    }
  };

  _proto.updateReadyState = function updateReadyState(readyState) {
    var _context;

    this.readyState = readyState;
    (0, _forEach["default"])(_context = this.listeners).call(_context, function (listener) {
      listener();
    });
  };

  _proto.subscribe = function subscribe(listener) {
    this.listeners.push(listener);
  };

  _proto.unsubscribe = function unsubscribe(listener) {
    var _context2;

    this.listeners = (0, _filter["default"])(_context2 = this.listeners).call(_context2, function (item) {
      return item !== listener;
    });
  };

  _proto.retain = function retain() {
    return this.environment.retain(this.operation);
  };

  _proto.dispose = function dispose() {
    this.fetchPromise = null;

    if (this.selectionReference) {
      this.selectionReference.dispose();
    }

    if (this.pendingRequest) {
      this.pendingRequest.unsubscribe();
    }

    if (this.rootSubscription) {
      this.rootSubscription.dispose();
    }
  };

  _proto.getQueryName = function getQueryName() {
    return this.operation.root.node.name;
  };

  return QuerySubscription;
}();

exports["default"] = QuerySubscription;
module.exports = exports.default;