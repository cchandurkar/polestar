'use strict';

/**
 * @ngdoc service
 * @name polestar.Prov
 * @description
 * # Provenance
 * Service in the polestar.
 */
angular.module('polestar').service('Prov', function ($window, vl, consts, dl, Spec) {

  // Create Trail
  var trail = jstrails.create()
    .addControls()
    .renderTo();

  // Undo
  trail.undo(function(current, prev){
    if(prev){
      console.log("Prev", prev);
      Spec.updateByProv(prev);
    } else {
      Spec.reset();
    }
  });

  // Redo
  trail.redo(function(current, next){
    Spec.update(next.spec);
  });

  // Done
  trail.done(function(){

  });

  // Get Checkpoint
  trail.checkpoint().get(function(){
    return Spec.spec;
  });

  // Set Checkpoint
  trail.checkpoint().set(function(spec){
    Spec.update(spec);
  });

  // Create Action
  var addPill = trail.createAction('addPill')
    .toString(function(data){ return "Added \"" + data.encoding.field + "\" to \"" + data.channel +"\""; })
    .forward(function(state, diff){ })
    .inverse(function(state, prevDiff){ });

  // Remove Pill
  var removePill = trail.createAction('removePill')
    .toString(function(data){ return "Removed \"" + data.encoding.field + "\" from \"" + data.channel + "\""; })
    .forward(function(state, diff){ })
    .inverse(function(state, prevDiff){ });

  // Update Type
  var updateType = trail.createAction('updateType')
    .toString(function(diff){ return "Type Updated"; })
    .forward(function(state, diff){ })
    .inverse(function(state, prevDiff){ });

  // Moved Pills
  var movePill = trail.createAction('movePill')
    .toString(function(data){ return data.encoding.field + " moved from \"" + data.channelFrom + "\" to \"" + data.channelTo + "\""; })
    .forward(function(state, diff){ })
    .inverse(function(state, prevDiff){ });

  // Moved Pills
  var updateMarkType = trail.createAction('movedPills')
    .toString(function(data){ return "Pill Moved"; })
    .forward(function(state, diff){ })
    .inverse(function(state, prevDiff){ });

  // Provenance
  var Prov = { };

  // --------------------------------------
  // Capture Functions
  // --------------------------------------

  // Adding new pill
  Prov.addPill = function(etDragTo, encoding){
    trail.record(addPill, {
      channel: etDragTo,
      encoding: encoding,
      spec: Spec.spec
    });
  };

  // Moving Pill
  Prov.movePill = function(etDragFrom, etDragTo, encoding){
    trail.record(movePill, {
      channelFrom: etDragFrom,
      channelTo: etDragTo,
      encoding: encoding,
      spec: Spec.spec
    });
  };

  // Remove Pill
  Prov.removePill = function(channel, encoding){
    trail.record(removePill, {
      channel: removePill,
      encoding: encoding,
      spec: Spec.spec
    });
  };

  // On Spec Updates
  Prov.onSpecUpdate = function(fromSpec, toSpec){

  };

  // --------------------------------------
  // UI and Navigation
  // --------------------------------------

  // Can Undo
  Prov.canUndo = function(){
    return trail.currentNode().parentNode() !== null;
  };

  // Can Undo
  Prov.canRedo = function(){
    return trail.currentNode().childNodes().length > 0;
  };

  // Undo
  Prov.undo = function(){
    trail.previous();
  };

  // Redo
  Prov.redo = function(){
    trail.next();
  };

  // Show Gallery
  Prov.showGallery = function(){
    trail.openGallery();
  };

  // if(Object.keys(diff).length > 1){
  //   var keys = Object.keys(diff).join(", ");
  //   var idx = keys.lastIndexOf(",");
  //   return "Updated " + keys.substr(0, idx) + " and " + keys.substr(idx + 1);
  // } else {
  //   return "Updated " + Object.keys(diff)[0];
  // }


  return Prov;
});
