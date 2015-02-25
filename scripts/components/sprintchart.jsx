'use strict';

var React = require('react');
var request = require('superagent');
var LineChart = require("react-chartjs").Line;

var SprintChartComponent = React.createClass({

  getInitialState: function () {
    return {
      data: {},
      opt: {
        multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>"
      },
      url: 'https://spreadsheets.google.com/feeds/worksheets/1BEpf0nRMUm3X9kopyv1feO2XQfGWT48L2kym9y2ZmnA/public/full?alt=json'
    };
  },

  componentDidMount: function () {
    var self = this;
    request
      .get(this.state.url)
      .end(function (res) {
        if (res.ok) {
          var firstSheet = res.body.feed.entry[0];
          self.loadData(firstSheet);
        }
      });
  },

  loadData: function (sheet) {
    var self = this;
    var url = sheet.link[0].href + "?alt=json";
    var time = [];
    var todo = [];
    var prog = [];
    var rqfb = [];
    var done = [];

    request
      .get(url)
      .end(function (res) {
        if (res.ok) {
          var feed = res.body.feed;
          var entries = feed.entry;

          var doneKey = feed.title.$t.toLowerCase().replace(/[()\/]/g, '');
          entries.forEach(function (entry) {
            time.push(entry.gsx$time.$t);
            todo.push(parseInt(entry.gsx$todothissprint.$t));
            prog.push(parseInt(entry.gsx$inprogress.$t));
            rqfb.push(parseInt(entry.gsx$requestforfeedback.$t));
            done.push(parseInt(entry['gsx$' + doneKey].$t));
          });

          var data = {
            labels: time,
            datasets: [
              {
                label: "To do",
                fillColor: "rgba(87,198,185,0.1)",
                strokeColor: "rgba(87,198,185,1)",
                pointColor: "rgba(87,198,185,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(122,178,234,1)",
                data: todo
              },
              {
                label: "In Progress",
                fillColor: "rgba(163,142,243,0.1)",
                strokeColor: "rgba(163,142,243,1)",
                pointColor: "rgba(163,142,243,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(163,142,243,1)",
                data: prog
              },
              {
                label: "Feedback",
                fillColor: "rgba(233,102,132,0.1)",
                strokeColor: "rgba(233,102,132,1)",
                pointColor: "rgba(233,102,132,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(122,178,234,1)",
                data: rqfb
              },
              {
                label: feed.title.$t,
                fillColor: "rgba(122,178,234,0.1)",
                strokeColor: "rgba(122,178,234,1)",
                pointColor: "rgba(122,178,234,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(122,178,234,1)",
                data: done
              }
            ]
          };

          self.setState({
            data: data
          });
        }
      });
  },

  render: function () {
    return (
      <div>
        <LineChart data={this.state.data} options = {this.state.opt}
          width="900" height="500" redraw/>
      </div>
    )
  }
});

module.exports = SprintChartComponent;
