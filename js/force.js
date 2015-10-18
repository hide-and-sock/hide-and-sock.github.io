var width = 500,
    height = 500;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

function process(dataObject){
  var graph = {};
  graph["nodes"] = [];
  graph["links"] = [];

  for(var i=0; i<Object.keys(dataObject).length; i++){
    el = dataObject[Object.keys(dataObject)[i]];
    graph["nodes"].push({
      "name" : el.name,
      "group" : el.zone,
    });
    el.number = i;
  }
  console.log(dataObject);
  for(var i=0; i<Object.keys(dataObject).length; i++){
    var el = dataObject[Object.keys(dataObject)[i]];
    for(var j=0; j<el.finds.length; j++){
      graph["links"].push({
        "source": i,
        "target": dataObject[el.finds[j]].number,
        "value": el.score
      })
    }
  }
  console.log(graph);

  return graph;
}

function renderGraph(input){
  var graph = input;
  force.nodes(graph.nodes)
    .links(graph.links)
    .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { 
        return 0.2*Math.sqrt(d.value); 
      });

  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .style("fill", function(d) { 
        return color(d.group); 
      })
      .call(force.drag);

  node.append("title")
      .text(function(d) { return d.name; });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });  
}

