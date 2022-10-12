/* ----------------------------------------------------------------------------
File: BarGraphSample.js
Contructs the Bar Graph using D3
80 characters perline, avoid tabs. Indet at 4 spaces. See google style guide on
JavaScript if needed.
-----------------------------------------------------------------------------*/ 

// Search "D3 Margin Convention" on Google to understand margins.
// Add comments here in your own words to explain the margins below
/*
    The margins give space for text to be placed around the bar chart
    in order to help explain what the chart is meant to be.
*/
var margin = {top: 10, right: 40, bottom: 150, left: 50},
    width = 760 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    

// Define SVG. "g" means group SVG elements together. 
// Add comments here in your own words to explain this segment of code
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* --------------------------------------------------------------------
SCALE and AXIS are two different methods of D3. See D3 API Refrence and 
look up SVG AXIS and SCALES. See D3 API Refrence to understand the 
difference between Ordinal vs Linear scale.
----------------------------------------------------------------------*/ 

// Define X and Y SCALE.
// Add comments in your own words to explain the code below
var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);

var yScale = d3.scaleLinear().range([height, 0]);

// Define X and Y AXIS
// Define tick marks on the y-axis as shown on the output with an interval of 5 and $ sign
var xAxis = d3.axisBottom(xScale);

var yAxis = d3.axisLeft(yScale)
    .ticks(4);


/* --------------------------------------------------------------------
To understand how to import data. See D3 API refrence on CSV. Understand
the difference between .csv, .tsv and .json files. To import a .tsv or
.json file use d3.tsv() or d3.json(), respectively.
----------------------------------------------------------------------*/ 

// data.csv contains the country name(country) and its GDP(gdp)
// d.country and d.gdp are very important commands
// You must provide comments here to demonstrate your understanding of these commands

function rowConverter(data) {
    return {
        country : data.country,
        gdp : data.gdp
    }
}

d3.csv("GDP2022TrillionUSDollars.csv",rowConverter).then(function(data){
    
    // Return X and Y SCALES (domain). See Chapter 7:Scales (Scott M.) 
    xScale.domain(data.map(function(d){ return d.country; }));
    yScale.domain([0,d3.max(data, function(d) {return d.gdp; })]);
    console.log(d3.max(data, function(d) {return d.gdp;}));
    console.log(data)
    
    
    // Creating rectangular bars to represent the data. 
    // Add comments to explain the code below
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .transition().duration(1000)
        .delay(function(d,i) {return i * 200;})
        .attr("x", function(d) {
            return xScale(d.country);
        })
        .attr("y", function(d) {
            console.log(d.gdp)
            console.log(yScale(d.gdp))
            return yScale(d.gdp);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) {
            return height- yScale(d.gdp);
        }).attr("fill", function(d){
            return "rgb(0,0," + Math.round(300/d.gdp)+ ")";
        });
    
        // create increasing to decreasing shade of blue as shown on the output
    // Label the data gdps(d.gdp)
    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {
            return d.gdp;
        })
        .attr("x", function(d, i){
            return i * (width / data.length) + 13;
        })
        .attr("y", function(d) {
            return height - (d*4)+15; 
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white");
           
    
    // Draw xAxis and position the label at -60 degrees as shown on the output 
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .style("text-anchor", "end")
        .attr("font-size", "10px")
        .attr("transform", "rotate(-60)");
        
    
    // Draw yAxis and position the label

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    ;
});
