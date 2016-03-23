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
    Spec.spec = prev ? prev.spec : Spec.instantiate();
  });

  // Redo
  trail.redo(function(current, next){
    Spec.spec = next.spec;
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
    Spec.spec = spec;
  });

  // Common Forward Action
  var forwardCommon = function(state, next){
      state = next.spec;
      return state;
  };

  //  Common Inverse Action
  var inverseCommon = function(state, current, prev){
    if(prev){
      state = prev.spec;
    }
    return state;
  };

  // Create Action
  var addPill = trail.createAction('addPill')
    .toString(function(data){ return "Added \"" + data.pill.field + "\" to \"" + data.dragTo +"\""; })
    .forward(forwardCommon).inverse(inverseCommon);

  // Remove Pill
  var removePill = trail.createAction('removePill')
    .toString(function(data){ return "Removed \"" + data.pill.field + "\" from \"" + data.channel + "\""; })
    .forward(forwardCommon).inverse(inverseCommon);

  // Moved Pills
  var movePill = trail.createAction('movePill')
    .toString(function(data){ return data.pill.field + " moved from \"" + data.dragFrom + "\" to \"" + data.dragTo + "\""; })
    .forward(forwardCommon).inverse(inverseCommon);

  // Update Pill Function
  var updatePillFunc = trail.createAction('updatePillFunc')
    .toString(function(data){ return "Updated Function of \"" + data.pill.field + "\" to \"" + data.func + "\""; })
    .forward(forwardCommon).inverse(inverseCommon);

  // Update Pill Mark
  var updateMark = trail.createAction('updateMark')
    .toString(function(data){ return "Updated Mark to \"" + data.mark + "\""})
    .forward(forwardCommon).inverse(inverseCommon);

  // Provenance
  var Prov = { };

  // --------------------------------------
  // Capture Functions
  // --------------------------------------

  // Adding new pill
  Prov.addPill = function(pill, dragTo){
    trail.record(addPill, {
      pill: pill,
      dragTo: dragTo,
      spec: Spec.spec
    });
  };

  // Moving Pill
  Prov.movePill = function(pill, dragFrom, dragTo){
    trail.record(movePill, {
      pill: pill,
      dragFrom: dragFrom,
      dragTo: dragTo,
      spec: Spec.spec
    });
  };

  // Remove Pill
  Prov.removePill = function(pill, channel){
    trail.record(removePill, {
      pill: pill,
      channel: channel,
      spec: Spec.spec
    });
  };

  // Update Pill
  Prov.updatePillFunc = function(pill, func){
    trail.record(updatePillFunc, {
      pill: pill,
      func: func,
      spec: Spec.spec
    });
  };

  // Update Pill Mark
  Prov.updateMark = function(mark){
    trail.record(updateMark, {
      mark: mark,
      spec: Spec.spec
    });
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
