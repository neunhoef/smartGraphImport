function storeGraph(r, Vname, Ename, Gname) {
  // r a graph made by makeTree or makeClusteredGraph, Vname a string for the
  // name of the vertex collection, Ename a string for the name of the edge
  // collection, Gname is the name of the named graph, returns an object
  // with two attributes "graph" with the general graph object and "data"
  // with the object to be used by simulateBreadthFirstSearch.
  let db = require('internal').db;
  let V = db._collection(Vname);
  let E = db._collection(Ename);
  let g;
  require("internal").print("Saving vertices...");
  let v = V.insert(r.vertices);
  for (let i = 0; i < r.vertices.length; ++i) {
    r.vertices[i]._id = v[i]._id;
    r.vertices[i]._key = v[i]._key;
    r.vertices[i]._rev = v[i]._rev;
  }
  for (let i = 0; i < r.edges.length; ++i) {
    let e = r.edges[i];
    e._from = r.vertices[e._from]._id;
    e._to = r.vertices[e._to]._id;
  }
  let i = 0;
  while (i < r.edges.length) {
    let j = i + 100000;
    j = j > r.edges.length ? r.edges.length : j;
    let chunk = r.edges.slice(i, j);
    if (chunk.length > 1) {
      E.insert(r.edges.slice(i, j));
    }
    require("internal").print("Inserted " + chunk.length + " documents...")
    i = j;
  }
  return { data: { vertices: V.toArray(), edges: E.toArray() },
           graph };
}

var h = require("@arangodb/graph/helpers.js");
var r = h.makeClusteredGraph([100023,99876,76263,5000,19293,98763,102934,102348,104522,76387], 5, 3, 0.0005, 123456);
db._drop("Vnaive");
db._drop("Enaive");
db._drop("Vsmart");
db._drop("Esmart");
Vname = "Vsmart";
Ename = "Esmart";
Gname = "Gsmart";
var gm = require("@arangodb/smart-graph.js");
var g = require("@arangodb/general-graph.js");
var rel = g._relation(Ename, Vname, Vname);
var graph = gm._create(Gname, [rel], [], 
          {numberOfShards: 4, 
           smartGraphAttribute: "subgraphId", isSmart: true});
storeGraph(r, Vname, Ename);

var r = h.makeClusteredGraph([100023,99876,76263,5000,19293,98763,102934,102348,104522,76387], 5, 3, 0.0005, 123456);
var Vnaive = db._create("Vnaive", {numberOfShards: 4});
var Enaive = db._createEdgeCollection("Enaive", {numberOfShards: 4});
storeGraph(r, "Vnaive", "Enaive");
var graph = g._create("Gnaive");
graph._extendEdgeDefinitions(g._relation("Enaive", ["Vnaive"], ["Vnaive"]));


