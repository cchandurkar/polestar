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
  var trail = SIMProv.UITrail()
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

  // Common Undo
  var undoCommon = function(current, previous){
    Spec.spec = previous.spec;
  };

  // Common Redo
  var redoCommon = function(current, next){
    Spec.spec = next.spec;
  };

  var addPill = trail.createAction('addPill', {
    forward: forwardCommon,
    inverse: inverseCommon,
    undo: undoCommon,
    redo: redoCommon,
    format: function(data){ return "Added \"" + data.pill.field + "\" to \"" + data.dragTo +"\""; }
  });

  var removePill = trail.createAction('addPill', {
    forward: forwardCommon,
    inverse: inverseCommon,
    undo: undoCommon,
    redo: redoCommon,
    format: function(data){ return "Removed \"" + data.pill.field + "\" to \"" + data.channel +"\""; }
  });

  var movePill = trail.createAction('movePill', {
    forward: forwardCommon,
    inverse: inverseCommon,
    undo: undoCommon,
    redo: redoCommon,
    format: function(data){ return data.pill.field + " moved from \"" + data.dragFrom + "\" to \"" + data.dragTo + "\""; }
  });

  var updatePillFunc = trail.createAction('updatePillFunc', {
    forward: forwardCommon,
    inverse: inverseCommon,
    undo: undoCommon,
    redo: redoCommon,
    format: function(data){ return "Updated Function of \"" + data.pill.field + "\" to \"" + data.func + "\""; }
  });

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
    }, function(change){
      Prov.captureThumbnail(change, 800);
    });
  };

  // Moving Pill
  Prov.movePill = function(pill, dragFrom, dragTo){
    trail.record(movePill, {
      pill: pill,
      dragFrom: dragFrom,
      dragTo: dragTo,
      spec: Spec.spec
    }, function(change){
      Prov.captureThumbnail(change, 800);
    });
  };

  // Remove Pill
  Prov.removePill = function(pill, channel){
    trail.record(removePill, {
      pill: pill,
      channel: channel,
      spec: Spec.spec
    }, function(change){
      Prov.captureThumbnail(change, 800);
    });
  };

  // Update Pill
  Prov.updatePillFunc = function(pill, func){
    trail.record(updatePillFunc, {
      pill: pill,
      func: func,
      spec: Spec.spec
    }, function(change){
      Prov.captureThumbnail(change, 800);
    });
  };

  // Update Pill Mark
  Prov.updateMark = function(mark){
    trail.record(updateMark, {
      mark: mark,
      spec: Spec.spec
    }, function(change){
      Prov.captureThumbnail(change, 800);
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

  Prov.loadJSON = function(){
    trail.loadJSON();
  };

  Prov.saveJSON = function(){
    trail.saveJSON();
  };

  Prov.exportGist = function(){
    trail.exportToGist(null, function(err, gist){
      if(err){
        alert("Export Failed:\n\n" + err.message);
      } else {
        alert("Exported To: " + gist.id);
      }
    });
  };

  Prov.captureThumbnail = function(change, timeout){
    setTimeout(function(){
      var canvas = d3.select('.vega canvas').node();
      change.setThumbnail(canvas.toDataURL());
    }, timeout);
  }

  Prov.importGist = function(){
    trail.importGist(prompt("Enter gist id"));
  };

  // Show Gallery
  Prov.showGallery = function(){
    trail.openGallery();
  };

  return Prov;
});
