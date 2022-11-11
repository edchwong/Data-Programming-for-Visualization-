//Setting width and height of the svg
var width = 1000,
    height = 500;

//Creating SVG
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height + 100);

//Declaring the default color scale
var colors1 = d3.schemeBlues[9];
var colors2 = d3.schemePuRd[9];

var color = d3.scaleThreshold()
    .domain([0, 5, 10, 50, 100, 250, 500, 1000, 1500])
    .range(colors1);


//Defining the scale for the legend
var x = d3.scaleSqrt()
    .domain([0, 1500])
    .range([50, 900]);

//Appending a g element to the svg
var g = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(0,550)");

//Making the legend
//Appending an area to the svg for our legend
//Append a rectangle to our legend area 
//Using x to scale our rectangles to the correct size
//Color the rectangles according to the scheme in relation
//to population density
//from mike bostock
var g = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(0,550)");

g.selectAll("rect")
    .data(color.range().map(function(d) {
    //console.log(d);
        d = color.invertExtent(d);
        //console.log(d);
        if (d[0] == null) d[0] = x.domain()[0];
        if (d[1] == null) d[1] = x.domain()[1];
        return d;
    }))
    .enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d) { return x(d[0]); })
    .attr("width", function(d) {return x(d[1]) - x(d[0]); })
    .attr("fill", function(d) { return color(d[0]); });

//Adding the title to the legend
g.append("text")
    .attr("class", "caption")
    .attr("x", x.range()[0])
    .attr("y", -6)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("Population Density per County");

//Adding the ticks to the legend to differntiate the densities
g.call(d3.axisBottom(x)
    .tickSize(15)
    .tickValues(color.domain()));

//Accessing the data
d3.json("counties-10m.json", function(error, counties) {
    if (error) return console.error(error);
    
    //Filtering the counties and putting them in an object so that fitsize can call it
    //Mike Bostock
    var utah_counties = topojson.feature(counties, counties.objects.counties).features.filter((d) => parseInt(d.id) >= 49000 && parseInt(d.id) <= 49999);
    // seperating out the geojson information
    var geojson = {"type":"FeatureCollection", "features": utah_counties};
    var projection = d3.geoAlbersUsa().scale(1).fitSize([width, height], geojson);
    var path = d3.geoPath().projection(projection);
    //console.log(counties);
    
    //Accessing the density data
    var utah_densities;
    d3.csv("Utah_County_Population.csv", function(error, population) {
        if (error) return console.error(error);
        
        //Filtering the density data for just Utah
        var utah_population = population.filter((d) => d["GEO.display-label"] === "Utah");
        //console.log(utah_population);
        utah_densities = utah_population.map(function(d) { return d["Density per square mile of land area"]});
        
        //Putting the filter data in objects
        const county_density = {};
        const counties_obj = {};
        //console.log(utah_population);
        
        // extract each population matching the county name and store it county_density
        utah_population.forEach(d => (county_density[d["GCT_STUB.display-label"]] = d["Density per square mile of land area"]));
        
        // extract each population matching the county name and store it uta
        utah_counties.forEach(d => (counties[d.properties.name] = d));
        
        //Drawing the counties that make up the whole state
        //When mouse over tooltip appears
        // tool tip help from stack overflow
        svg.selectAll("path")
            .data(utah_counties)
            .enter().append("path")
            .style("fill", function(d) {return color(county_density[d.properties.name + " County"]);})
            .attr("d", path)
            .on("mouseover", function(d) {
                //console.log(d);
                d3.select("#tooltip")
<<<<<<< HEAD
                    .style("left", (d3.event.clientX+20) + "px")
=======
                    .style("left", (d3.event.clientX + 20) + "px")
>>>>>>> 0c55c5066b65f89762ebbf5e66872d513f263bec
                    .style("top", (d3.event.clientY - 20) + "px");
                d3.select(".title")
                    .text(d.properties.name);
                d3.select("#pop")
                    .text(county_density[d.properties.name + " County"]);
                d3.select("#tooltip").classed("hidden", false);
            })
            .on("mouseout", function() {
                d3.select("#tooltip").classed("hidden", true);
                    
            });
        
        //When County border is clicked then the borders are highlighted with black stroke
        var checkbox = document.querySelector('input[type="checkbox"]');

        checkbox.addEventListener('change', function () {
            if (checkbox.checked) {
                svg.selectAll("path").attr("stroke", "#111");
            } else {
                svg.selectAll("path").attr("stroke", "none");
            }
        });
        
        //When color button is clicked then the map changes color scheme
        //help from Gary Finco
        var change_color = document.querySelector('#change_color');

        change_color.addEventListener('change', function () {
            if (change_color.checked) {
                color.range(d3.schemePuRd[9]);
                svg.selectAll("path").style("fill", function(d) { 
                    return color(county_density[d.properties.name + " County"]);});
                g.selectAll("rect").attr("fill", function(d) { 
                    console.log(color(d[0]));
                    return color(d[0]); });
            } else {
                color.range(d3.schemeBlues[9])
                svg.selectAll("path").style("fill", function(d) { 
                    return color(county_density[d.properties.name + " County"]);});
                g.selectAll("rect").attr("fill", function(d) { 
                    return color(d[0]); });
            }
        });
    });
});
