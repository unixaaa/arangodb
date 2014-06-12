/*jslint indent: 2, nomen: true, maxlen: 100, white: true, plusplus: true, unparam: true */
/*global require, applicationContext*/

////////////////////////////////////////////////////////////////////////////////
/// @brief A Foxx.Controller to show all Foxx Applications
///
/// @file
///
/// DISCLAIMER
///
/// Copyright 2010-2013 triagens GmbH, Cologne, Germany
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
/// Copyright holder is triAGENS GmbH, Cologne, Germany
///
/// @author Michael Hackstein
/// @author Copyright 2011-2014, triAGENS GmbH, Cologne, Germany
////////////////////////////////////////////////////////////////////////////////
(function() {
  "use strict";

  var FoxxController = require("org/arangodb/foxx").Controller,
    controller = new FoxxController(applicationContext),
    ArangoError = require("org/arangodb").ArangoError,
    actions = require("org/arangodb/actions"),
    Model = require("org/arangodb/foxx").Model,
    Graph = require("org/arangodb/general-graph"),
    errors = require("internal").errors,
    toId = function(c, k) {
      return c + "/" + k;
    },
    _ = require("underscore"),
    setResponse = function (res, name, body, code) {
      var obj = {};
      obj.error = false;
      obj.code = code || actions.HTTP_OK;
      if (name !== undefined && body !== undefined) {
        obj[name] = body;
        if (body._rev) {
          res.set("etag", body._rev);
        }
      }
      res.json(obj);
      if (code) {
        res.status(code);
      }
    },
    setGraphResponse = function(res, g, code) {
      code = code || actions.HTTP_OK;
      setResponse(res, "graph", {
        name: g.__name,
        edgeDefinitions: g.__edgeDefinitions
      }, code);
    };

  /** Create a new vertex.
   *
   * Stores a new vertex with the information contained
   * within the body into the given collection.
   */
  controller.post("/:graph/vertex/:collection", function(req, res) {
    var name = req.params("graph");
    var collection = req.params("collection");
    var body = req.params("vertex");
    var g = Graph._graph(name);
    setResponse(res, "vertex", g[collection].save(body.forDB()));
  })
  .pathParam("graph", {
    type: "string",
    description: "Name of the graph."
  })
  .pathParam("collection", {
    type: "string",
    description: "Name of the vertex collection."
  })
  .bodyParam("vertex", "The document to be stored", Model);

  /** Load a vertex.
   *
   * Loads a vertex with the given id if it is contained
   * within your graph.
   */
  controller.get("/:graph/vertex/:collection/:key", function(req, res) {
    var name = req.params("graph");
    var collection = req.params("collection");
    var key = req.params("key");
    var id = toId(collection, key);
    var g = Graph._graph(name);
    setResponse(res, "vertex", g[collection].document(id));
  })
  .pathParam("graph", {
    type: "string",
    description: "Name of the graph."
  })
  .pathParam("collection", {
    type: "string",
    description: "Name of the vertex collection."
  })
  .pathParam("key", {
    type: "string",
    description: "_key attribute of one specific vertex."
  })
  .errorResponse(
    ArangoError, actions.HTTP_NOT_FOUND, "The vertex does not exist.", function(e) {
      return {
        code: actions.HTTP_NOT_FOUND,
        error: e.errorMessage
      };
    }
  );

  /** Replace a vertex.
   *
   * Replaces a vertex with the given id by the content in the body.
   * This will only run successfully if the vertex is contained
   * within the graph.
   */
  controller.put("/:graph/vertex/:collection/:key", function(req, res) {
    var name = req.params("graph");
    var collection = req.params("collection");
    var key = req.params("key");
    var id = toId(collection, key);
    var body = req.params("vertex");
    var g = Graph._graph(name);
    setResponse(res, "vertex", g[collection].replace(id, body.forDB()));
  })
  .pathParam("graph", {
    type: "string",
    description: "Name of the graph."
  })
  .pathParam("collection", {
    type: "string",
    description: "Name of the vertex collection."
  })
  .pathParam("key", {
    type: "string",
    description: "_key attribute of one specific vertex."
  })
  .bodyParam("vertex", "The document to be stored", Model)
  .errorResponse(
    ArangoError, actions.HTTP_NOT_FOUND, "The vertex does not exist.", function(e) {
      return {
        code: actions.HTTP_NOT_FOUND,
        error: e.errorMessage
      };
    }
  );

  /** Update a vertex.
   *
   * Updates a vertex with the given id by adding the content in the body.
   * This will only run successfully if the vertex is contained
   * within the graph.
   */
  controller.patch("/:graph/vertex/:collection/:key", function(req, res) {
    var name = req.params("graph");
    var collection = req.params("collection");
    var key = req.params("key");
    var id = toId(collection, key);
    var body = req.params("vertex");
    var g = Graph._graph(name);
    setResponse(res, "vertex", g[collection].update(id, body.forDB()));
  })
  .bodyParam("vertex", "The values that should be modified", Model)
  .pathParam("graph", {
    type: "string",
    description: "Name of the graph."
  })
  .pathParam("collection", {
    type: "string",
    description: "Name of the vertex collection."
  })
  .pathParam("key", {
    type: "string",
    description: "_key attribute of one specific vertex."
  })
  .errorResponse(
    ArangoError, actions.HTTP_NOT_FOUND, "The vertex does not exist.", function(e) {
      return {
        code: actions.HTTP_NOT_FOUND,
        error: e.errorMessage
      };
    }
  );

  /** Delete a vertex.
   *
   * Deletes a vertex with the given id, if it is contained
   * within the graph.
   * Furthermore all edges connected to this vertex will be deleted.
   */
  controller.del("/:graph/vertex/:collection/:key", function(req, res) {
    var name = req.params("graph");
    var collection = req.params("collection");
    var key = req.params("key");
    var id = toId(collection, key);
    var g = Graph._graph(name);
    setResponse(res, "vertex", g[collection].remove(id));
  })
  .pathParam("graph", {
    type: "string",
    description: "Name of the graph."
  })
  .pathParam("collection", {
    type: "string",
    description: "Name of the vertex collection."
  })
  .pathParam("key", {
    type: "string",
    description: "_key attribute of one specific vertex."
  })
  .errorResponse(
    ArangoError, actions.HTTP_NOT_FOUND, "The vertex does not exist.", function(e) {
      return {
        code: actions.HTTP_NOT_FOUND,
        error: e.errorMessage
      };
    }
  );

  ///////////////////////////////////////////////// Edges //////////
  
  /** Create a new edge definition.
   *
   * Stores a new edge definition with the information contained
   * within the body.
   * This has to contain the edge-collection name, as well as set of from and to
   * collections-names respectively. 
   */
  controller.post("/:graph/edge", function(req, res) {
    var name = req.params("graph");
    var body = req.params("edgeDefinition");
    var g = Graph._graph(name);
    g._extendEdgeDefinitions(body.forDB());
    setGraphResponse(res, g);
  })
  .pathParam("graph", {
    type: "string",
    description: "Name of the graph."
  })
  .bodyParam(
    "edgeDefinition", "The edge definition to be stored.", Model
  )
  .errorResponse(
    ArangoError, actions.HTTP_BAD, "The edge definition is invalid.", function(e) {
      return {
        code: actions.HTTP_BAD,
        error: e.errorMessage
      };
    }
  );

  /** Create a new edge.
   *
   * Stores a new edge with the information contained
   * within the body into the given collection.
   */
  controller.post("/:graph/edge/:collection", function(req, res) {
    var name = req.params("graph");
    var collection = req.params("collection");
    var body = req.params("edge");
    var from = body.get("_from");
    var to = body.get("_to");
    var err;
    if (!from || !to) {
      err = new ArangoError();
      err.errorNum = errors.ERROR_GRAPH_INVALID_EDGE.code;
      err.errorMessage = errors.ERROR_GRAPH_INVALID_EDGE.message;
      throw err;
    }
    var g = Graph._graph(name);
    setResponse(res, "edge", g[collection].save(from, to, body.forDB()));
  })
  .pathParam("graph", {
    type: "string",
    description: "Name of the graph."
  })
  .pathParam("collection", {
    type: "string",
    description: "Name of the edge collection."
  })
  .bodyParam(
    "edge", "The edge to be stored. Has to contain _from and _to attributes.", Model
  )
  .errorResponse(
    ArangoError, actions.HTTP_BAD_REQUEST, "The edge could not be created.", function(e) {
      return {
        code: actions.HTTP_BAD_REQUEST,
        error: e.errorMessage
      };
    }
  );

  /** Load an edge.
   *
   * Loads an edge with the given id if it is contained
   * within your graph.
   */
  controller.get("/:graph/edge/:collection/:key", function(req, res) {
    var name = req.params("graph");
    var collection = req.params("collection");
    var key = req.params("key");
    var id = toId(collection, key);
    var g = Graph._graph(name);
    setResponse(res, "edge", g[collection].document(id));
  })
  .pathParam("graph", {
    type: "string",
    description: "Name of the graph."
  })
  .pathParam("collection", {
    type: "string",
    description: "Name of the edge collection."
  })
  .pathParam("key", {
    type: "string",
    description: "_key attribute of one specific edge."
  })
  .errorResponse(
    ArangoError, actions.HTTP_NOT_FOUND, "The edge does not exist.", function(e) {
      return {
        code: actions.HTTP_NOT_FOUND,
        error: e.errorMessage
      };
    }
  );

  /** Replace an edge.
   *
   * Replaces an edge with the given id by the content in the body.
   * This will only run successfully if the edge is contained
   * within the graph.
   */
  controller.put("/:graph/edge/:collection/:key", function(req, res) {
    var name = req.params("graph");
    var collection = req.params("collection");
    var key = req.params("key");
    var id = toId(collection, key);
    var body = req.params("edge");
    var g = Graph._graph(name);
    setResponse(res, "edge", g[collection].replace(id, body.forDB()));
  })
  .pathParam("graph", {
    type: "string",
    description: "Name of the graph."
  })
  .pathParam("collection", {
    type: "string",
    description: "Name of the edge collection."
  })
  .pathParam("key", {
    type: "string",
    description: "_key attribute of one specific edge."
  })
  .bodyParam("edge", "The document to be stored. _from and _to attributes are ignored", Model)
  .errorResponse(
    ArangoError, actions.HTTP_NOT_FOUND, "The edge does not exist.", function(e) {
      return {
        code: actions.HTTP_NOT_FOUND,
        error: e.errorMessage
      };
    }
  );

  /** Update an edge.
   *
   * Updates an edge with the given id by adding the content in the body.
   * This will only run successfully if the edge is contained
   * within the graph.
   */
  controller.patch("/:graph/edge/:collection/:key", function(req, res) {
    var name = req.params("graph");
    var collection = req.params("collection");
    var key = req.params("key");
    var id = toId(collection, key);
    var body = req.params("edge");
    var g = Graph._graph(name);
    setResponse(res, "edge", g[collection].update(id, body.forDB()));
  })
  .bodyParam(
    "edge", "The values that should be modified. _from and _to attributes are ignored", Model
  )
  .pathParam("graph", {
    type: "string",
    description: "Name of the graph."
  })
  .pathParam("collection", {
    type: "string",
    description: "Name of the edge collection."
  })
  .pathParam("key", {
    type: "string",
    description: "_key attribute of one specific edge."
  })
  .errorResponse(
    ArangoError, actions.HTTP_NOT_FOUND, "The edge does not exist.", function(e) {
      return {
        code: actions.HTTP_NOT_FOUND,
        error: e.errorMessage
      };
    }
  );

  /** Delete an edge.
   *
   * Deletes an edge with the given id, if it is contained
   * within the graph.
   */
  controller.del("/:graph/edge/:collection/:key", function(req, res) {
    var name = req.params("graph");
    var collection = req.params("collection");
    var key = req.params("key");
    var id = toId(collection, key);
    var g = Graph._graph(name);
    setResponse(res, "edge", g[collection].remove(id));
  })
  .pathParam("graph", {
    type: "string",
    description: "Name of the graph."
  })
  .pathParam("collection", {
    type: "string",
    description: "Name of the edge collection."
  })
  .pathParam("key", {
    type: "string",
    description: "_key attribute of one specific edge."
  })
  .errorResponse(
    ArangoError, actions.HTTP_NOT_FOUND, "The edge does not exist.", function(e) {
      return {
        code: actions.HTTP_NOT_FOUND,
        error: e.errorMessage
      };
    }
  );

///////////////// GRAPH /////////////////////////////////

  /** Creates a new graph
   *
   * Creates a new graph object
   */
  controller.post("/", function(req, res) {
    var infos = req.params("graph");
    var g = Graph._create(infos.get("name"), infos.get("edgeDefinitions"));
    setGraphResponse(res, g, actions.HTTP_CREATED);
  }).errorResponse(
    ArangoError, actions.HTTP_CONFLICT, "Graph creation error.", function(e) {
      return {
        code: actions.HTTP_CONFLICT,
        error: e.errorMessage
      };
    }
  ).bodyParam("graph", "The required information for a graph", Model);

  /** Drops an existing graph
   *
   * Drops an existing graph object by name.
   * By default all collections not used by other graphs will be dropped as
   * well. It can be optionally configured to not drop the collections.
   */
  controller.del("/:graph", function(req, res) {
    var name = req.params("graph");
    Graph._drop(name);
    setResponse(res);
  })
  .pathParam("graph", {
    type: "string",
    description: "Name of the graph."
  })
  .errorResponse(
    ArangoError, actions.HTTP_NOT_FOUND, "The graph does not exist.", function(e) {
      return {
        code: actions.HTTP_NOT_FOUND,
        error: e.errorMessage
      };
    }
  );




}());

// -----------------------------------------------------------------------------
// --SECTION--                                                       END-OF-FILE
// -----------------------------------------------------------------------------

/// Local Variables:
/// mode: outline-minor
/// outline-regexp: "/// @brief\\|/// @addtogroup\\|/// @page\\|// --SECTION--\\|/// @\\}\\|/\\*jslint"
/// End:
