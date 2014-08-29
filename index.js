var d3 = require('d3')
var d3sankey = require('./sankey')

function exportData(graph) {
  var txNodes = graph.getAllNodes()
  var nodes = txNodes.map(function(n) {
    var value, fee
    if(n.tx) {
      value = n.tx.value
      fee = n.tx.fee
    }
    return { name: n.id, fee: fee, value: value }
  })

  var links = txNodes.reduce(function(memo, n, i) {
    n.nextNodes.forEach(function(next) {
      memo.push({ source: i, target: txNodes.indexOf(next), value: 1 })
    })

    return memo
  }, [])

  return { nodes: nodes, links: links }
}

// Adapted from: http://bost.ocks.org/mike/sankey/
function visualizeWithData(data, containerSelector, margin) {
  var margin = margin || {top: 1, right: 1, bottom: 6, left: 1}
  var width = 960 - margin.left - margin.right
  var height = 500 - margin.top - margin.bottom

  var color = d3.scale.category20()

  var svg = d3.select(containerSelector).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var sankey = d3sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .size([width, height]);

  var path = sankey.link();

  sankey
      .nodes(data.nodes)
      .links(data.links)
      .layout(32, width);

  var link = svg.append("g").selectAll(".link")
      .data(data.links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke-width", function(d) { return Math.max(1, d.dy); })
      .sort(function(a, b) { return b.dy - a.dy; });

  link.append("title")
      .text(function(d) { return d.source.name + " → " + d.target.name });

  var node = svg.append("g").selectAll(".node")
      .data(data.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    .call(d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", function() { this.parentNode.appendChild(this); })
      .on("drag", dragmove));

  node.append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
      .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
    .append("title")
      .text(function(d) { return d.name + "\nvalue: " + d.value + "\nfee: " + d.fee; });

  node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.name.substr(0, 4); })
    .filter(function(d) { return d.x < width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");

  // css
  svg.selectAll('.node rect')
      .style({
        cursor: "move",
        "fill-opacity": .9,
        "shape-rendering": "crispEdges"
      })

  svg.selectAll('.node text')
      .style({
        "pointer-events": "none",
        "text-shadow": "0 1px 0 #fff"
      })

  svg.selectAll('.link')
      .style({
        fill: "none",
        stroke: "#000",
        "stroke-opacity": .2
      })
      .on('mouseover', function(){
        d3.select(this).style({"stroke-opacity": .5});
      })
      .on('mouseout', function(){
        d3.select(this).style({"stroke-opacity": .2});
      })

  function dragmove(d) {
    d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
    sankey.relayout();
    link.attr("d", path);
  }
}

function visualize(txGraph, containerSelector, margin) {
  var data = exportData(txGraph)
  visualizeWithData(data, containerSelector, margin)
}

module.exports = {
  exportData: exportData,
  visualizeWithData: visualizeWithData,
  visualize: visualize
}

