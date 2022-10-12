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
    height = 700 - margin.top - margin.bottom;//540
    

// Define SVG. "g" means group SVG elements together. 
// Add comments here in your own words to explain this segment of code
/*
    creates a canvas for all our visuals to be drawn. We use the margin 
    created above in order to offset where things will start to draw from 
    so that we can have a clear seperation between any labels, and 
    the visualization of our data.
*/

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
/*
    The following code scales the values that we insert into the function
    so that they can fit our given svg canvas. If our data were not scaled,
    it is likely that they would not match what our chart is supposed to 
    look like. We also create the x and y axis labels here.
*/
var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);

var yScale = d3.scaleLinear().range([height, 0]);

// Define X and Y AXIS
// Define tick marks on the y-axis as shown on the output with an interval of 5 and $ sign
var xAxis = d3.axisBottom(xScale);

var yAxis = d3.axisLeft(yScale)
    .tickFormat(function(d){
        return "$" + d;
    })
    .ticks(4);


/* --------------------------------------------------------------------
To understand how to import data. See D3 API refrence on CSV. Understand
the difference between .csv, .tsv and .json files. To import a .tsv or
.json file use d3.tsv() or d3.json(), respectively.
----------------------------------------------------------------------*/ 

// data.csv contains the country name(country) and its GDP(gdp)
// d.country and d.gdp are very important commands
// You must provide comments here to demonstrate your understanding of these commands
/*
    the rowConverter function is used to create an object that holds the data, country 
    and gdp
    the csv() function takes the data out of the csv file and creates an array of objects 
    that hold a country and gdp
    the xScale function figures out how many values need to be shown along the x axis
    the yScale function finds out the maximum range that needs to be displayed on the
    y axis 
*/

function rowConverter(data) {
    return {
        country : data.country,
        gdp : data.gdp
    }
}

d3.csv("GDP2022TrillionUSDollars.csv",rowConverter).then(function(data){
    
    // Return X and Y SCALES (domain). See Chapter 7:Scales (Scott M.) 
    xScale.domain(data.map(function(d){ return d.country; }));

    yScale.domain([0,d3.max(data, function(d) {return parseInt(d.gdp);})]);
    
    // Creating rectangular bars to represent the data. 
    // Add comments to explain the code below
    /*
        This creates each "bar" that is to be displayed in our bar chart.
        the width of it is determined by the .bandwidth function, and the height
        of each bar is determined by the height of the svc canvas - the scaled 
        valueof the gdp of each country. The color of each bar has a minimum value
        of 0,0,50 and increases along the gradiant of blue as the gdp gets lower.
        
    */
    
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
            return yScale(d.gdp);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) {
            return height - yScale(d.gdp);
        })
        .attr("fill", function(d){
            return "rgb(0,0," + (Math.round(255/d.gdp)+50) + ")";
        });
    
        // create increasing to decreasing shade of blue as shown on the output
    // Label the data gdps(d.gdp)
    /*
        a new text object is created for each bar on the chart, with the value of
        the country's gdp. It is then offset such that it lays just underneath the
        top of each bar that it represents.
        The x axis is labeled with the name of each country, and is then offset 
        such that it is displayed underneath the x axis, and within the margin. 
        The label is then rotated -60 degrees to allow for easy readability
        The y axis is given a title, in the form of text, and is then rotated
        and displaced such that it is aligned vertically and within the left 
        margin area of the bar chart
        
        The "x" and "y" attributes of the axes determine the start position of
        the labels, while the "dx" "dy" values determine the how far apart the labels will be from one another
        
    */
    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .transition().duration(1000)
        .delay(function(d,i) {return i * 200;})
        .text(function(d) {
            return d.gdp;
        })
        .attr("text-anchor","start")
        .attr("x", function(d){
            return xScale(d.country)+5;
        })
        .attr("y", function(d) {
            return yScale(d.gdp)+15;
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
        .attr("font-size", "12px")
        .attr("transform", "rotate(-60)");
        
    
    // Draw yAxis and position the label

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-90)")
        .attr("y", -3*margin.left/4)
        .attr("x", -height/3)
        .style("text-anchor", "end")
        .attr("fill", "black")
        .text("Trillions of US Dollars ($)");
});