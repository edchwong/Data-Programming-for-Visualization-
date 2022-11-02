//Define Margin
var margin = {left: 80, right: 80, top: 50, bottom: 50 }, 
    width = 960 - margin.left -margin.right,
    height = 500 - margin.top - margin.bottom;

//Define Color
var colors = d3.scaleOrdinal(d3.schemeCategory20);

//Define SVG
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    //.style("background", "red")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// rectangle for the legend
var legend = svg.append('rect')
    .attr('x', 520)
    .attr('y', 180)
    .attr('width', 230)
    .attr('height', 200)
    .attr("fill", "#BEBEBE");

// small circle
svg.append("circle")
        .attr("class", "circle")
        .attr("r", 5)
        .attr("cx", 690)
        .attr("cy", 200)
        .style("stroke","black")
        .style("fill", "white");
svg.append("text")
        .attr("class", "label")
        .attr("y", 205)
        .attr("x", 575)
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill","#000")
        .text("10 Trillion BTUs");

// medium circle
svg.append("circle")
        .attr("class", "circle")
        .attr("r", 25)
        .attr("cx", 690)
        .attr("cy", 240)
        .style("stroke","black")
        .style("fill", "white");
svg.append("text")
        .attr("class", "label")
        .attr("y", 240)
        .attr("x", 575)
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill","#000")
        .text("50 Trillion BTUs");

// large circle
svg.append("circle")
        .attr("class", "circle")
        .attr("r", 50)
        .attr("cx", 690)
        .attr("cy", 320)
        .style("stroke","black")
        .style("fill", "white");
svg.append("text")
        .attr("class", "label")
        .attr("y", 320)
        .attr("x", 575)
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill","#000")
        .text("100 Trillion BTUs");
        
    
//Define Scales   
var xScale = d3.scaleLinear()
    .domain([0,16]) //Need to redefine this later after loading the data
    .range([0, width]);

var yScale = d3.scaleLinear()
    .domain([0,450]) //Need to redfine this later after loading the data
    .range([height, 0]);


//Define Axis
var xAxis = d3.axisBottom().scale(xScale);
var yAxis = d3.axisLeft().scale(yScale);

//Get Data
var scatterdataset = [];

d3.csv("scatterdata.csv", function(data)  {
    console.log(data);
// change the data from string to floats
    data.forEach(function(d) {
        d.country= d.country,
        d.gdp= parseFloat(d.gdp),
        d.population= parseFloat(d.population),
        d.ecc= parseFloat(d.ecc)
        d.ec=parseFloat(d.ec)
    }
    );
    scatterdataset = data;

    var zoom = d3.zoom()
    .on("zoom", zoomFunction);

     // append zoom area
    var view = svg.append("rect")
      .attr("class", "zoom")
      .attr("width", width)
      .attr("height", height)
      .call(zoom);

    // append area for drawing
    var innerSpace = svg.append("g")
        .attr("class", "inner_space")
        .attr("width", width)
        .attr("height", height)
        .call(zoom);

    // Define domain for xScale and yScale
    xScale.domain([
        0,
        d3.max(scatterdataset, function(d) {return d.gdp;})+2
     ]);  

    yScale.domain([
        0,
        d3.max(scatterdataset, function(d) {return d.ecc;})+50
    ]);


    //Draw Scatterplot
    var dots = innerSpace.selectAll(".dot")
        .data(scatterdataset)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("r", function(d) {return (d.ecc*d.population)/2000})
        .attr("cx", function(d) {return xScale(d.gdp);})
        .attr("cy", function(d) {return yScale(d.ecc);})
        .style("fill", function (d) {return colors(d.country); });


    //x-axis
    var x_Axis = innerSpace.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);


    //Y-axis
    var y_Axis = innerSpace.append("g")
        .attr("class", "y axis")
        .call(yAxis)


    // zoom--------------------------------------------------
    //Scale Changes as we Zoom
    // Call the function d3.behavior.zoom to Add zoom
    function zoomFunction(){
      // create new scale ojects based on event
      var new_xScale = d3.event.transform.rescaleX(xScale)
      var new_yScale = d3.event.transform.rescaleY(yScale)

      //console.log(d3.event.transform)

      // update axes
      x_Axis.call(xAxis.scale(new_xScale));
      y_Axis.call(yAxis.scale(new_yScale));

      // update dots
      dots.attr("transform", d3.event.transform)
    };


    //labeling the x Axis
    x_Axis.append("text")
        .attr("class", "label")
        .attr("y", 50)
        .attr("x", width/2)
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill","#000")
        .text("GDP (in Trillion US Dollars) in 2020");

    //labeling the y Axis
    y_Axis.append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .attr("fill","#000")
        .text("Energy Consumption per Capita (in Million BTUs per person)");

   
    
    // Tool Tips section------------------------------
    //Add .on("mouseover", .....
    //Add Tooltip.html with transition and style
    //Then Add .on("mouseout", ....
    var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
    
    //defining the tool tip
    var tooltip = d3.select("tooltips")
            .append("div")
            .enter()
    
    // showing the tool tip on mouse over event of a dot
    dots.on("mousemove", function(d) {		
            div.transition()		
            .duration(100)		
            .style("opacity", .9);
            //tool tips 
            div.html(
                //country name
                "<h3>" + d.country+"</h3>" +
                //population row
                "<div>"+
                "<div style=\"float:left;width:95px;text-align:left;\">Population</div>" + 
                "<div style=\"float:right;width:95px;text-align:right;\">"+ d.population +" Million" +
                "</div>"+
                "<div style=\"text-align:center;\"> : </div></div>"
                +
                //GDP
                "<div>"+
                "<div style=\"float:left;width:95px;text-align:left;\">GDP</div>" + 
                "<div style=\"float:right;width:95px;text-align:right;\">$"+ d.gdp +" Trillion" +
                "</div>"+
                "<div style=\"text-align:center;\"> : </div></div>"
                +
                //EPC
                "<div>"+
                "<div style=\"float:left;width:95px;text-align:left;\">EPC</div>" + 
                "<div style=\"float:right;width:95px;text-align:right;\">"+ d.ecc +" Million BTUs" +
                "</div>"+
                "<div style=\"text-align:center;\"> : </div></div>"
                +
                "<div>"+
                "<div style=\"float:left;width:95px;text-align:left;\">Total</div>" + 
                "<div style=\"float:right;width:95px;text-align:right;\">"+ d.ec +" Trillion BTUs" +
                "</div>"+
                "<div style=\"text-align:center;\"> : </div></div>"

            )	
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });

    /*    
    //Draw Country Names
    var names = innerSpace.selectAll(".text")
        .data(scatterdataset)
        .enter()
        .append("text")
        .attr("class","text")
        .style("text-anchor", "start")
        .attr("x", function(d) {return xScale(d.gdp);})
        .attr("y", function(d) {return yScale(d.ecc);})
        .style("fill", "black")
        .text(function (d) {return d.country; });
    */
    
    
   
});

