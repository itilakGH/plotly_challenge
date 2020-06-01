function init() {

  // Reading the sample's IDs from the file and loading it into the drop down menu
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
     });
    
  })
}
  
  // Selecting a new sample and displaying its info in the panel
  function optionChanged(newSample) {
    buildMetadata(newSample);
    re_buildCharts();
  };
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      PANEL.append("h6").text("ID: " + result.id);
      PANEL.append("h6").text("ETHNICITY: " + result.ethnicity);
      PANEL.append("h6").text("GENDER: " + result.gender);
      PANEL.append("h6").text("AGE: " + result.age);
      PANEL.append("h6").text("LOCATION: " + result.location);
      PANEL.append("h6").text("bbType: " + result.bbtype);
      PANEL.append("h6").text("WFREQ: " + result.wfreq);
    });
      
  };

  // Recreating all charts to be discpayed when a new sample is selected
  function re_buildCharts() {

    // Getting the selected sample value
    var ddMenu = d3.select("#selDataset");
    var dataset = ddMenu.property("value");
    
    // Creating a function that would hold all variables, filtered values, values for the charts
    // and creating the charts
    d3.json("samples.json").then(function(data){
      var samMap = data.samples.filter(id => id.id === dataset).map(person => person.sample_values).sort((a,b) => b - a);
      var otuMap = data.samples.filter(id => id.id === dataset).map(person => person.otu_ids);
      var lblsMap = data.samples.filter(id => id.id === dataset).map(person => person.otu_labels);

      var wfreqMap = data.metadata 
      var wfreqMapFltr = wfreqMap.filter(id => id.id == dataset).map(person => person.wfreq);
      var wfreq = Object.values(wfreqMapFltr);
      var wfreqInt = parseInt(wfreq);
            
      var otu_values = Object.values(otuMap[0]);
      var sam_values = Object.values(samMap[0]);
      var lbls_values = Object.values(lblsMap[0]);
      var top_sam_values = sam_values.slice(0,10);
      var top_otu_values = otu_values.slice(0,10).map(item => 'OTU ' + item);
      var top_lbls_values = lbls_values.slice(0,10);
      
      // Creating the horizontal bar chart
      var trace = {
        x: top_sam_values.reverse(),
        y: top_otu_values.reverse(),
        type: "bar",
        orientation: 'h',
        mode: 'markers',
        marker: {size: 16},
        text: top_lbls_values
      };
      var data = [trace];
      var layout = {
        title: "Top 10 Species of Bacteria Found in the Sample",
        xaxis: { title: "Samples Count" },
        yaxis: { title: "OTU IDs"}        
      };
      Plotly.newPlot("bar", data, layout);

      // Creating the gauge chart
      var gauge_chart = [{
        domain: {x: [0,1], y: [0,1]},
        value: wfreqInt,
        title: {text: "Belly Button Washing Frequency<br>(scrabs per week)"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range: [null, 10]},
          steps: [
            {range: [0,7], color: "lightgray"},
            {range: [7,10], color: "gray"}
          ],
          threshold: {
            line: {color: "red", width: 4},
            thikness: 0.35,
            value: 7
            }
          }
        }
      ];
      var layout = {width: 600, height: 450, margin: {t:0, b:0}};
      Plotly.newPlot("gauge", gauge_chart, layout);

      // Creating the bubble chart
      var bubbleChart = {
        x: otu_values,
        y: sam_values,
        text: lbls_values,
        mode: 'markers',
        marker: {
        color: otu_values,
        size: sam_values
        }
      };
      
      var data = [bubbleChart];
      var layout = {
      title: 'All Species Found in the Sample',
      showlegend: false,
      height: 600,
      width: 1300
        };
      Plotly.newPlot('bubble', data, layout);
    });
  };

  init();



// Initializing the datail panel, setting the first drop down value by default
// and reflecting all details in the panel
window.addEventListener('DOMContentLoaded', (event) => {

  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == "940");
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");
    
    PANEL.html("");
    PANEL.append("h6").text("ID: " + result.id);
    PANEL.append("h6").text("ETHNICITY: " + result.ethnicity);
    PANEL.append("h6").text("GENDER: " + result.gender);
    PANEL.append("h6").text("AGE: " + result.age);
    PANEL.append("h6").text("LOCATION: " + result.location);
    PANEL.append("h6").text("bbType: " + result.bbtype);
    PANEL.append("h6").text("WFREQ: " + result.wfreq);

    // Calling the charts function that all charts are discplayed on the page when it is loaded for default value
    buildCharts();
    }); 
});
  // Creating the charts for freshly loaded page
  function buildCharts() {

    // Getting the selected sample value
    var ddMenu = d3.select("#selDataset");
    var dataset = ddMenu.property("value");
    
    // Creating a function that would hold all variables, filtered values, values for the charts
    // and creating the charts
    d3.json("samples.json").then(function(data){
      var samMap = data.samples.filter(id => id.id === dataset).map(person => person.sample_values).sort((a,b) => b - a);
      var otuMap = data.samples.filter(id => id.id === dataset).map(person => person.otu_ids);
      var lblsMap = data.samples.filter(id => id.id === dataset).map(person => person.otu_labels);

      var wfreqMap = data.metadata 
      var wfreqMapFltr = wfreqMap.filter(id => id.id == dataset).map(person => person.wfreq);
      var wfreq = Object.values(wfreqMapFltr);
      var wfreqInt = parseInt(wfreq);
            
      var otu_values = Object.values(otuMap[0]);
      var sam_values = Object.values(samMap[0]);
      var lbls_values = Object.values(lblsMap[0]);
      var top_sam_values = sam_values.slice(0,10);
      var top_otu_values = otu_values.slice(0,10).map(item => 'OTU ' + item);
      var top_lbls_values = lbls_values.slice(0,10);
      
      // Creating the horizontal bar chart
      var trace = {
        x: top_sam_values.reverse(),
        y: top_otu_values.reverse(),
        type: "bar",
        orientation: 'h',
        mode: 'markers',
        marker: {size: 16},
        text: top_lbls_values
      };
      var data = [trace];
      var layout = {
        title: "Top 10 Species of Bacteria Found in the Sample",
        xaxis: { title: "Samples Count" },
        yaxis: { title: "OTU IDs"}        
      };
      Plotly.newPlot("bar", data, layout);

      // Creating the gauge chart
      var gauge_chart = [{
        domain: {x: [0,1], y: [0,1]},
        value: wfreqInt,
        title: {text: "Belly Button Washing Frequency<br>(scrabs per week)"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range: [null, 10]},
          steps: [
            {range: [0,7], color: "lightgray"},
            {range: [7,10], color: "gray"}
          ],
          threshold: {
            line: {color: "red", width: 4},
            thikness: 0.35,
            value: 7
            }
          }
        }
      ];
      var layout = {width: 600, height: 450, margin: {t:0, b:0}};
      Plotly.newPlot("gauge", gauge_chart, layout);

      // Creating the bubble chart
      var bubbleChart = {
        x: otu_values,
        y: sam_values,
        text: lbls_values,
        mode: 'markers',
        marker: {
        color: otu_values,
        size: sam_values
        }
      };
      
      var data = [bubbleChart];
      var layout = {
      title: 'All Species Found in the Sample',
      showlegend: false,
      height: 600,
      width: 1300
        };
      Plotly.newPlot('bubble', data, layout);
    });
  };
