var width = 500,
    height = 400;

var color = d3.scale.category10();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);

var svg = d3.select("#graphs").append("svg");
    // .attr("width", width)
    // .attr("height", height);

function process(dataObject){
  var graph = {};
  graph["nodes"] = [];
  graph["links"] = [];

  for(var i=0; i<Object.keys(dataObject).length; i++){
    el = dataObject[Object.keys(dataObject)[i]];
    graph["nodes"].push({
      "name" : el.name,
      "location" : el.location,
      "group" : el.zone,
      "team" : el.team,
      "score": el.score
    });
    el.number = i;
  }

  for(var i=0; i<Object.keys(dataObject).length; i++){
    var el = dataObject[Object.keys(dataObject)[i]];
    for(var j=0; j<el.finds.length; j++){
      if (el.finds[j] in dataObject){
        if (el.team != dataObject[el.finds[j]].team){
          graph["links"].push({
            "source": i,
            "target": dataObject[el.finds[j]].number,
            "value": el.score
          });
        }
      }
    }
  }

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
      return scaling_thickness*Math.sqrt(d.value); 
    });

  var node = svg.selectAll(".node")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", function(d) { 
      return scaling_radius*Math.log(d.score); 
    })
    .style("fill", function(d) { 
      return color(d.team); 
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

