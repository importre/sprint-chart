'use strict';

var React = require('react');
window.React = React;

var SprintChart = require('./components/sprintchart.jsx');

React.render(<SprintChart />, document.getElementById('content'));
