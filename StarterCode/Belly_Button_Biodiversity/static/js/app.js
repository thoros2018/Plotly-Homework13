function buildMetadata(sample) {
  console.log("buildMetaldata")
 
  d3.json(`/metadata/${sample}`).then((sampleNames) => {
    console.log(sampleNames)
    var data = d3.select("#sample-metadata");
 
    data.html("")
    var results = Object.entries(sampleNames)
      results.forEach((row) => {
      data.append("h5").text(`${row[0]}:${row[1]}`);
      });
 
  });
 }
 
 function buildCharts(sample) {
  console.log("buildCharts")
  d3.json(`/samples/${sample}`).then((results) => {
    console.log(results)
    
  const topTenIDs = results.otu_ids;
  const topTenSamples = results.sample_values;
  const topTenLab = results.otu_labels;
 console.log(topTenIDs)
  
 var data = [{
    labels: topTenIDs.slice(0,10),
    values: topTenSamples.slice(0,10),
    hover: topTenLab.slice(0,10),
    type:"pie"

  }];
 
  var pieLayout = {
    margin:{t:0,1:0}
   };
 
  Plotly.newPlot("pie",data,pieLayout);

  var trace1 = {
    x: results.otu_ids,
    y: results.sample_values,
    mode: 'markers',
    marker: {
      size: results.sample_values,
      color: results.otu_ids,
      colorscale: "Jet"
    }
  };
  
  var bubbleData = [trace1];
  
  var bubbleLayout = {
    xaxis: {title: "OTU ID"}
  };
  
  Plotly.newPlot("bubble", bubbleData, bubbleLayout);
 
  });
 }

 function init() {
  console.log("init")
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
 
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
 
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
   
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
 }
 
 function optionChanged(newSample) {
  console.log("newSample")
  // Fetch new data each time a new sample is selected
  
  buildMetadata(newSample);
  buildCharts(newSample);
 }
 init();