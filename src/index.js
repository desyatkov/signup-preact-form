import "preact-cli/lib/lib/webpack/polyfills";
import 'core-js/fn/array/from';
import 'core-js/fn/object/assign';
import 'core-js/fn/object/assign';
import 'core-js/es6/symbol';
import 'core-js/es6/symbol';
import 'core-js/es6/set';
import 'core-js/es6/map';

import { h } from "preact";
import habitat from "preact-habitat";

import Widget from "./components/App";

let _habitat = habitat(Widget);

_habitat.render({
  selector: '[data-widget-host="auth"]',
  clean: true
});
