/* var scatterdataset = [ {
        "name": "United States",
        "country": "United States",
        "gdp": 14.9,
        "ecc": 317,
        "total": 98.9
    }, {

        "name": "China",
        "country": "China",
        "gdp": 5.93,
        "ecc": 76,
        "total": 103
    }, {
        "name": "Japan",
        "country": "Japan",
        "gdp": 5.49,
        "ecc": 171, 
        "total": 21.7
    }, {
        "name": "Germany",
        "country": "Germany",
        "gdp": 3.28,
        "ecc": 171,
        "total": 14.1
    }, {
        "name": "France",
        "country": "France",
        "gdp": 2.54,
        "ecc": 170,
        "total": 10.7
    }, {
        "name": "United Kingdom",
        "country": "United Kingdom",
        "gdp": 2.28,
        "ecc": 143,
        "total": 8.8
    }, {
        "name": "Brazil",
        "country": "Brazil",
        "gdp": 2.14,
        "ecc": 58,
        "total": 11.3
    }, {
        "name": "Italy",
        "country": "Italy",
        "gdp": 2.04,
        "ecc": 126,
        "total": 7.6
    }, {
        "name": "India",
        "country": "India",
        "gdp": 1.70,
        "ecc": 19,
        "total": 22.9
    }, {
        "name": "Canada",
        "country": "Canada",
        "gdp": 1.57,
        "ecc": 385,
        "total": 13.1
    }, {
        "name": "Russian Federation",
        "country": "Russian Federation",
        "gdp": 1.52,
        "ecc": 206,
        "total": 29.5
    }, {

        "name": "Spain",
        "country": "Spain",
        "gdp": 1.37,
        "ecc": 134,
        "total": 6.1
    }, {
        "name": "Australia",
        "country": "Australia",
        "gdp": 1.14,
        "ecc": 270,
        "total": 6.0
    }, {
        "name": "Mexico",
        "country": "Mexico",
        "gdp": 1.04,
        "ecc": 65,
        "total": 7.6
    }, {
        "name": "Korea",
        "country": "Korea",
        "gdp": 1.01,
        "ecc": 222,
        "total": 10.7
    }];
    */
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
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Define Scales   
    var xScale = d3.scaleLinear()
        .domain([0,16]) //Need to redefine this later after loading the data
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0,450]) //Need to redfine this later after loading the data
        .range([height, 0]);
    
    //Define Tooltip here
    
      
       //Define Axis
    var xAxis = d3.axisBottom().scale(xScale).tickPadding([2]);
    var yAxis = d3.axisLeft().scale(yScale).tickPadding([2]);
    
    //Get Data
    var scatterdataset = [];

    d3.csv("scatterdata.csv", function(data){
        console.log(data);
        data.forEach(function(d) {
            d.country= d.country,
            d.gdp= parseFloat(d.gdp),
            d.population= parseFloat(d.population),
            d.ecc= parseFloat(d.ecc)
            d.ec=parseFloat(d.ec)
        }
        );
        scatterdataset = data;
        //console.log(scatterdataset);
    // Define domain for xScale and yScale
    xScale.domain([
        0,
        d3.max(scatterdataset, function(d) {return d.gdp;})+2
     ]);  
    
    yScale.domain([
        0,
        d3.max(scatterdataset, function(d) {return d.ecc;})+50
    ]);
    
    //Add .on("mouseover", .....
    //Add Tooltip.html with transition and style
    //Then Add .on("mouseout", ....
    var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
        
    var tooltip = d3.select("tooltips")
            .append("div")
            .enter()
            /*.style("position", "absolute")
            .style("visibility", "visible")
            .style("background-color", "orange")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")*/
    
    //Draw Scatterplot
    svg.selectAll(".dot")
        .data(scatterdataset)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("r", function(d) {return (d.ecc*d.population)/2000})
        .attr("cx", function(d) {return xScale(d.gdp);})
        .attr("cy", function(d) {return yScale(d.ecc);})
        .style("fill", function (d) {return colors(d.country); })
        /*.on("mouseover", function(d){return tooltip.style("visibility", "visible");})
        .on("mousemove", function(d){return tooltip.style("top", (d3.event.pageY)+"px").style("left",(d3.event.pageX)+"px");})
        .on("mouseout", function(d){return tooltip.style("visibility", "hidden");});
        */
        .on("mouseover", function(d) {		
            div.transition()		
            .duration(200)		
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
        })
        .call(d3.zoom().on("zoom", function () {
              svg.attr("transform", d3.event.transform)
        }));
        
        
        
    //Scale Changes as we Zoom
    // Call the function d3.behavior.zoom to Add zoom

    //Draw Country Names
        svg.selectAll(".text")
        .data(scatterdataset)
        .enter().append("text")
        .attr("class","text")
        .style("text-anchor", "start")
        .attr("x", function(d) {return xScale(d.gdp);})
        .attr("y", function(d) {return yScale(d.ecc);})
        .style("fill", "black")
        .text(function (d) {return d.country; });

 //x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("y", 50)
        .attr("x", width/2)
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill","#000")
        .text("GDP (in Trillion US Dollars) in 2020");

    
    //Y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .attr("fill","#000")
        .text("Energy Consumption per Capita (in Million BTUs per person)");

    


        
    });
    
    