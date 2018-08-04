export default function (data) {
  const graph = {'nodes': [], 'links': []}

  data.forEach(function (d) {
    if (!graph.nodes.includes(d.source)) {
      graph.nodes.push(d.source)
    }
    if (!graph.nodes.includes(d.target)) {
      graph.nodes.push(d.target)
    }
    graph.links.push({ 'source': d.source, 'target': d.target, 'value': +d.value })
  })

  // loop through each link replacing the text with its index from node
  graph.links.forEach(function (d, i) {
    graph.links[i].source = graph.nodes.indexOf(graph.links[i].source)
    graph.links[i].target = graph.nodes.indexOf(graph.links[i].target)
  })

  // now loop through each nodes to make nodes an array of objects
  // rather than an array of strings
  graph.nodes.forEach(function (d, i) {
    graph.nodes[i] = { 'name': d }
  })

  return graph
}
