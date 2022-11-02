// create the SVG
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// format numerical values to how we want
var formatNumber = d3.format(",.0f"),
    format = function(d) { return formatNumber(d) + " TWh"; },
    color = d3.scaleOrdinal(d3.schemeCategory10);

// sankey layout generator
var sankey = d3.sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .extent([[1, 1], [width - 1, height - 6]]);

//generate a link
var link = svg.append("g")
    .attr("class", "link")
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("stroke-opacity", 0.2)
    .selectAll("path");



//generate a node
var node = svg.append("g")
    .attr("class", "node")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .selectAll("g");

var graph;

d3.json("energy.json", function(error, energy) {
    if (error) throw error;

    graph = sankey(energy);
    
    // generate/draw the link between nodes
    link = link
        .data(energy.links)
        .enter().append("path")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke-width", function(d) { return Math.max(1, d.width); })
        .on("mouseover", function(d) {
            console.log(d);
            
        })
            ;

    // link tool tip
    link.append("title")
        .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value) + "/" + format(d.target.value); });
    
    // generates and appends new nodes 
    node = node
        .data(energy.nodes)
        .enter().append("g")
        //.on("mousedown",highlight_node_links)
        .call(d3.drag()
            .subject(function(d){return d})
            //.on('start', function () { this.parentNode.appendChild(this); })
            .on('drag', dragmove));
        
    // creates the mouse over tool tip block
    node.append("rect")
        .attr("x", function(d) { return d.x0; })
        .attr("y", function(d) { return d.y0; })
        .attr("height", function(d) { return d.y1 - d.y0; })
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("fill", function(d) { return color(d.name.replace(/ .*/, "")); })
        .attr("stroke", "#000");

    node.append("text")
        .attr("x", function(d) { return d.x0 - 6; })
        .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .text(function(d) { return d.name; })
        .filter(function(d) { return d.x0 < width / 2; })
        .attr("x", function(d) { return d.x1 + 6; })
        .attr("text-anchor", "start");

    node.append("title")
        .text(function(d) { return d.name + "\n" + format(d.value); });

        // the function for moving the nodes
    function dragmove(d) {
        var rectY = d3.select(this).select("rect").attr("y");
        d.y0 = d.y0 + d3.event.dy;
        var yTranslate = d.y0 - rectY;
        d3.select(this).attr("transform", 
                "translate(0" + "," + (yTranslate) + ")");
        sankey.update(graph);
        link.attr("d",d3.sankeyLinkHorizontal());
    }
    

    /*
        a linked list traversal that goes through each connected link 
        starting from the selected node, and changes the opacity of 
        the link when clicked.
    */
    var i=0;

    function highlight_node_links(node){
        i=0;
        var remainingNodes=[],
        nextNodes=[];
        console.log(this);
        console.log(node);
        var stroke_opacity = 0;
        if( d3.select(this).attr("data-clicked") == "1" ){
            d3.select(this).attr("data-clicked","0");
            stroke_opacity = 0.2;
        }else{
            d3.select(this).attr("data-clicked","1");
            stroke_opacity = 0.5;
        }
    
        var traverse = [{
                          linkType : "sourceLinks",
                          nodeType : "target"
                        },{
                          linkType : "targetLinks",
                          nodeType : "source"
                        }];

        traverse.forEach(function(step){
            console.log(step);
            //console.log(traverse);
            node[step.linkType].forEach(function(link) {
                remainingNodes.push(link[step.nodeType]);
                highlight_link(link.index, stroke_opacity);
                //console.log(this.linkType+ "\n"+this.nodeType);
                //console.log("link: "+link + " " + link.index);
            });
            
            while (remainingNodes.length) {
                nextNodes = [];
                remainingNodes.forEach(function(node) {
                    node[step.linkType].forEach(function(link) {
                        nextNodes.push(link[step.nodeType]);
                        //console.log(link);
                        highlight_link(link.index, stroke_opacity);
                    });
                });
                remainingNodes = nextNodes;
            }
            //console.log(i);
        });
        //console.log(traverse);
    }
    
    

    function highlight_link(id,opacity){
         d3.select("#link-"+id).style("stroke-opacity", opacity);
        //console.log(id +" "+ opacity);
        i++;
    }
});