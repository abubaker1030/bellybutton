// Display the default plot
function init() {
  d3.json("samples.json").then(function (data) {
    var ids = data.samples.map(singleSubject=>singleSubject.id)
    // Append an option in the dropdown
    ids.forEach(function(id) {
      d3.select('#selDataset').append('option').text(id)
    }
  );

  // Create arrays for sample_values, OTU ids, and OTU labels        
  var sample_values = data.samples.map(singleSubject=> singleSubject.sample_values);
  var otu_ids = data.samples.map(singleSubject=> singleSubject.otu_ids);
  var otu_label = data.samples.map(singleSubject=> singleSubject.otu_labels);
  
  // Get the top 10 OTU
  var sorted_test = sample_values.sort(function(a, b){return b-a});
  var top_test = sorted_test.map(sample => sample.slice(0,10));
  var sorted_ids = otu_ids.sort(function(a, b){return b-a});
  var top_ids = sorted_ids.map(id =>id.slice(0,10));
  var sorted_labels = otu_label.sort(function(a, b){return b-a});
  var top_labels = sorted_labels.map(label =>label.slice(0,10));
  
  // Get the first ID to display on page on load
  var firstID = data.metadata[0]// first id
  var sampleMetadata1 = d3.select("#sample-metadata").selectAll('h1')
  
  //-------------------------------------------------
  // Display the first ID's demographic information
  var sampleMetadata = sampleMetadata1.data(d3.entries(firstID))
  sampleMetadata.enter()
                .append('h1')
                .merge(sampleMetadata)
                .text(d => `${d.key} : ${d.value}`)
                .style('font-size','50%')

  sampleMetadata.exit().remove()

  // Create Bar Chart
  // Create trace for bar chart
  var bar_chart_data = {
      x : top_test[0],
      y : top_ids[0].map(id => "OTU" + id),
      text : top_labels[0],
      type : 'bar',
      orientation : 'h',
      transforms: [{
          type: 'sort',
          target: 'y',
          order: 'descending',
      }],
      marker: {
        color: 'rgb(1, 122, 183)',
        line: {
          color: 'rgb(1, 122, 183)',
          opacity: 0.6,
          width: 1.5
        }
      }
  };
  // Create layout
  var layout1 = {
      title : '<b>Top 10 OTU</b>',
  };

  // Draw the bar chart
  var data = [bar_chart_data];
  var config = {responsive:true}
  Plotly.newPlot('bar', data, layout1,config);

  
  //Plot the weekly washing frequency in a gauge chart.
      // Get the first ID's washing frequency
      var firstWFreq = firstID.wfreq;

      // Calculations for gauge needle
      var firstWFreqDeg = firstWFreq * 20;
      var degrees = 180 - firstWFreqDeg;
      var radius = 0.5;
      var radians = (degrees * Math.PI) / 180;
      var x = radius * Math.cos(degrees * Math.PI / 180);
      var y = radius * Math.sin(degrees * Math.PI / 180);

    // Create path for gauge needle
    var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
    var mainPath = path1,
    pathX = String(x),
    space = ' ',
    pathY = String(y),
    pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    // Create trace for gauge chart (both the chart and the pointer)
    var dataGauge = [
        {
          type: "scatter",
          x: [0],
          y: [0],
          marker: { size: 12, color: "(27,161,187,1)" },
          showlegend: false,
          name: "Freq",
          text: firstWFreq,
          hoverinfo: "text+name"
        },
        {
          values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
          rotation: 90,
          text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
          textinfo: "text",
          textposition: "inside",
          marker: {
            colors: [
              'rgba(1, 122, 183,1)',
              'rgba(1, 122, 183,0.95)',
              'rgba(1, 122, 183,0.9)',
              'rgba(1, 122, 183,0.85)',
              'rgba(1, 122, 183,0.8)',
              'rgba(1, 122, 183,0.75)',
              'rgba(1, 122, 183,0.7)',
              'rgba(1, 122, 183,0.65)',
              'rgba(1, 122, 183,0.6)',
              'rgba(1, 122, 183,0)',
            ]
          },
          labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
          hoverinfo: "label",
          hole: 0.5,
          type: "pie",
          showlegend: false
        }
      ];

    // Create the layout for the gauge chart
    var layoutGauge = {
        shapes: [
          {
            type: "path",
            path: path,
            fillcolor: "rgba(27,161,187,1)",
            line: {
              color: "rgba(27,161,187,1)"
            }}],
        title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
        height: 550,
        width: 550,
        xaxis: {
          zeroline: false,
          showticklabels: false,
          showgrid: false,
          range: [-1, 1]
        },
        yaxis: {
          zeroline: false,
          showticklabels: false,
          showgrid: false,
          range: [-1, 1]
        }};
      var config = {responsive:true}
      // Plot the gauge chart
      Plotly.newPlot('gauge', dataGauge,layoutGauge,config);

  // Create a bubble chart 
  // Create the trace for the bubble chart
  var bubble_chart_data = {
      x : otu_ids[0],
      y : sample_values[0],
      text : otu_label[0],
      mode : 'markers',
      marker : {
          color : otu_ids[0],
          size : sample_values[0]
      }
  };

  // Create layout
  var layout2 = {
      title: '<b>Bubble Chart</b>',
      automargin: true,
      autosize: true,
      showlegend: false,
          margin: {
              l: 150,
              r: 50,
              b: 50,
              t: 50,
              pad: 4      
  }};

  // Draw the bubble chart
  var data2 = [bubble_chart_data];
  var config = {responsive:true}
  Plotly.newPlot('bubble',data2,layout2,config);

});
};


// Update the plot 
function updatePlotly(id) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function (data) {
    console.log(data);
      // Get the sample data
      var test = data.samples.filter(x => x.id === id);

      // Get the top 10 sample values
      var sample_values = test.map(x => x.sample_values).sort(function(a, b){return b-a});
      var top_values = sample_values.map(x => x.slice(0,10));

      // Get the top ten IDs
      var otu_ids = test.map(x=> x.otu_ids).sort(function(a, b){return b-a});
      var top_ids = otu_ids.map(x => x.slice(0,10));

      // Get the top ten labels
      var otu_label = test.map(x=> x.otu_labels).sort(function(a, b){return b-a});
      var top_labels = otu_label.map(x => x.slice(0,10));

      var metadataSamples = data.metadata.filter(x => x.id === +id)[0];

      // Get the demographic information
      var sampleMetadata1 = d3.select("#sample-metadata").selectAll('h1')
      var sampleMetadata = sampleMetadata1.data(d3.entries(metadataSamples))
      sampleMetadata.enter()
                    .append('h1')
                    .merge(sampleMetadata)
                    .text(d => `${d.key} : ${d.value}`)
                    .style('font-size','50%')
      
      // Create Bar Chart
      var bar_chart_data = {
          x : top_values[0],
          y : top_ids[0].map(x => "OTU" + x),
          text : top_labels[0],
          type : 'bar',
          orientation : 'h',
          transforms: [{
              type: 'sort',
              target: 'y',
              order: 'descending'
            }],
            marker: {
              color: 'rgb(1, 122, 183)',
              line: {
                color: 'rgb(1, 122, 183)',
                width: 1.5,
                opacity: 0.6,
              }
            }
      };

      // Create the layout
      var layout1 = {
          title: "<b>Top 10 OTU</b>"
      };
      var data1 = [bar_chart_data];
      var config = {responsive:true}

      // Plot the bar chart
      Plotly.newPlot('bar', data1,layout1,config);

      // Get the wash frequency for the current ID            
  var wFreq = metadataSamples.wfreq;
  var wFreqDeg = wFreq * 20;

  // Calculations for gauge pointer
  var degrees = 180 - wFreqDeg;
  var radius = 0.5;
  var radians = (degrees * Math.PI) / 180;
  var x = radius * Math.cos(degrees * Math.PI / 180);
  var y = radius * Math.sin(degrees * Math.PI / 180);

  // Create path
  var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
  var mainPath = path1,
  pathX = String(x),
  space = ' ',
  pathY = String(y),
  pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  // Create trace
  var dataGauge = [
      {
      type: "scatter",
      x: [0],
      y: [0],
      marker: { size: 12, color: "rgba(27,161,187,1)" },
      showlegend: false,
      name: "Freq",
      text: wFreq,
      hoverinfo: "text+name"
      },
      {
      values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
      rotation: 90,
      text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      textinfo: "text",
      textposition: "inside",
      marker: {
        colors: [
          'rgba(1, 122, 183,1)',
          'rgba(1, 122, 183,0.95)',
          'rgba(1, 122, 183,0.9)',
          'rgba(1, 122, 183,0.85)',
          'rgba(1, 122, 183,0.8)',
          'rgba(1, 122, 183,0.75)',
          'rgba(1, 122, 183,0.7)',
          'rgba(1, 122, 183,0.65)',
          'rgba(1, 122, 183,0.6)',
          'rgba(1, 122, 183,0)',
        ]
      },
      labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      hoverinfo: "label",
      hole: 0.5,
      type: "pie",
      showlegend: false
    }
  ];

// Create the layout
var layoutGauge = {
    shapes: [
      {
        type: "path",
        path: path,
        fillcolor: "rgba(27,161,187,1)",
        line: {
          color: "rgba(27,161,187,1)"
          }
      }
      ],
      title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
      height: 550,
      width: 550,
      xaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
      },
      yaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
      }
  };
  var config = {responsive:true}

  // Plot the gauge chart
  Plotly.newPlot('gauge', dataGauge,layoutGauge,config);
      

      // Create a bubble chart 
      // Create the trace for the bubble chart
      var bubble_chart_data = {
          x : test.map(x=> x.otu_ids)[0],
          y : test.map(x => x.sample_values)[0],
          text : test.map(x=> x.otu_labels),
          mode : 'markers',
          marker : {
              color : test.map(x=> x.otu_ids)[0],
              size : test.map(x => x.sample_values)[0]
          }   
      };

      // Create the layout
      var layout2 = {
          title: '<b>Bubble Chart</b>',
          automargin: true,
          autosize: true,
          showlegend: false,
          margin: {
              l: 150,
              r: 50,
              b: 50,
              t: 50,
              pad: 4
            }
      };

      // Create the bubble chart
      var data2 = [bubble_chart_data];
      var config = {responsive:true}
      Plotly.newPlot('bubble', data2,layout2,config)
  });
};


// Call updatePlotly
function optionChanged(id) {
  updatePlotly(id);
};

init();