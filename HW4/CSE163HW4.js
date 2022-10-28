/*
    Creating margins and setting the svg
*/
var svg = d3.select("svg"),
    margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// function to format the year
var parseTime = d3.timeParse("%Y");

// x is the X-Axis scaled by year
// y is the Y-Axis scaled by linear ticks
// z in this case is used to give each country a
// seperate color
var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);


// creates a smooth interpolated line to be drawn on the svg
var line = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d.BTU); });

function make_x_gridlines() {		
    return d3.axisBottom(x)
}

// gridlines in y axis function
function make_y_gridlines() {		
    return d3.axisLeft(y)

}

//processing the data
d3.csv("BRICSdata.csv", type, function(data) {
    // creates an array of (year,BTU) pairs for each
    // country. The csv holds each country as a column.
    var country = data.columns.slice(1).map(function(id) {
        return {
            id: id,
            values: data.map(function(d) {
                return {year: d.year, BTU: d[id]};
            })
        };
    });
    console.log(country)
    console.log(data)
    // the domain of the x axis is set as the lowest and highest 
    // year values
    x.domain(d3.extent(data, function(d) { return d.year; }));
    console.log(data,function (d){d.year});
    
    //the y domain is set as 0 and the highest BTU value 
    y.domain([
        0,
        d3.max(country, function(c) { return d3.max(c.values, function(d) { return parseInt(d.BTU); }); })
    ]);
    
    // z sets the color of each line as a different color
    z.domain(country.map(function(c) { return c.id; }));
     
    
     // add the X gridlines
    svg.append("g")			
        .attr("class", "grid")
        .call(make_x_gridlines()
            .tickSize(height)
            .tickFormat("")
        ).attr("transform","translate("+margin.left+ ","+margin.top+ ")");


    // add the Y gridlines
        svg.append("g")			
        .attr("class", "grid")
            .call(make_y_gridlines()
            .tickSize(-width) 
            .tickFormat("")
        ).attr("transform","translate("+margin.left+ ","+margin.top+ ")");

    // X Axis labels
    g.append("g")
    .attr("class", "axis axis--x")
    .call(d3.axisBottom(x))
    .attr("transform", "translate(0," + height + ")") //moves it to the bottom of the svg
    .attr("dx", "-.8em")
    .append("text")
    .attr("fill", "#000")
    .text("Years")
    .attr("x", width/2)
    .attr("y", 30)
    ;
    
    // Y Axis labels
    g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -3*margin.left/4)  // moves label into the left margin
    .attr("x", -height/3)   // offsets it so that it starts lower on the y axis
    .attr("fill", "#000")
    .text("Energy Consumption per Capita in Million BTU's per person");

    
    // placing the lines i
    var country = g.selectAll(".country")
    .data(country)
    .enter().append("g")
    .attr("class", "country");
     
    //drawing all the paths
    //defining the path here
    var path = country.append("path")
    .attr("class", "line")
    .attr("d", function(d) { return line(d.values); })
    .style("stroke", function(d) { return z(d.id); }) // coloring each path
    
    //getting the lengths of each path
    var  length = path.node().getTotalLength();
    
    //animating the paths
    path.attr("stroke-dasharray", length + " " + length)
        .attr("stroke-dashoffset", length)
          .transition()
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0)
          .duration(6000);
    
    console.log(country)
    
    //line labels
    country.append("text")
    .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })//cycling through the rows
    .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.BTU) + ")"; })
    //offsetting them to be next to the line
    .attr("x", 3)
    .attr("dy", "0.35em")
    .style("font", "10px sans-serif")
    .text(function(d) { return d.id; });
    //console.log(data) 
});

// function looks at the years column and formats it into a proper year value
function type(d, _, columns) {
  d.year = parseTime(d.year);
  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
  //console.log(d);
  return d;
}

