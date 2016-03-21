'use strict';

/**
 * @ngdoc service
 * @name polestar.Prov
 * @description
 * # Provenance
 * Service in the polestar.
 */
angular.module('polestar').service('Prov', function ($window, Dataset, vl, consts, dl) {

  // Create Trail
  var trail = jstrails.create();

  // Clear Checkpoint Rules
  trail.checkpoint()._rules = [];

  // Create Action
  var updateEncodingAction = trail.createAction('updateEncoding')
    .toString(function(data){
      if(Object.keys(data.diff).length > 1){
        var keys = Object.keys(data.diff).join(",");
        var idx = keys.lastIndexOf(",");
        return "Updated " + keys.substr(0, idx) + " and " + keys.substr(idx + 5);
      } else {
        return "Updated " + Object.keys(data.diff)[0];
      }
    })
    .forward(function(){ })
    .inverse(function(){ });

  //

  // Provenance
  var Prov = { };

  // Initialize
  Prov.initialize = function(){

  },

  // Reset
  Prov.reset = function(){

  },

  // Capture
  Prov.capture = function(spec){

    // Get the diff  with current
    // Diff only to check action taken
    var diff = null;
    if(trail.currentVersion() === 'root-node'){
      diff = spec;
    } else {
      diff = jsondiffpatch.diff(trail.currentChange().data().spec, spec);
    }

    console.log("Diff", diff);

    // Check if diffing against null data
    // 1st change
    trail.record(updateEncodingAction, {
      diff: Array.isArray(diff) ? diff[1] : diff,
      spec: spec
    });

  },

  // Undo
  Prov.undo = function(){

  },

  // Redo
  Prov.redo = function(){

  },

  Prov.specDiff = function(){

  },

  // Add Listener to onUpdate
  Dataset.onUpdate.push(Prov.reset);


  return Prov;
});
