/**
 * @license
 *
 * Copyright (c) 2015, University of Washington Interactive Data Lab.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 *
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * * Neither the name of the University of Washington Interactive Data Lab
 *   nor the names of its contributors may be used to endorse or promote products
 *   derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
"use strict";angular.module("polestar",["vlui","ngSanitize","ngTouch","ngDragDrop","zeroclipboard","Chronicle","LocalStorageModule","720kb.tooltips","ngOrderObjectBy","angular-google-analytics"]).constant("_",window._).constant("vl",window.vl).constant("vg",window.vg).constant("ZSchema",window.ZSchema).constant("Tether",window.Tether).constant("Drop",window.Drop).constant("Blob",window.Blob).constant("URL",window.URL).constant("dl",window.dl).constant("jsondiffpatch",window.jsondiffpatch).config(["consts",function(e){window.dl.extend(e,{appId:"polestar",initialSpec:window.initialSpec||void 0})}]).config(["uiZeroclipConfigProvider",function(e){e.setZcConf({swfPath:"bower_components/zeroclipboard/dist/ZeroClipboard.swf"})}]).config(["localStorageServiceProvider",function(e){e.setPrefix("polestar")}]).config(["AnalyticsProvider","consts",function(e,n){n.embeddedData||e.setAccount({tracker:"UA-44428446-4",name:"polestar",trackEvent:!0})}]),angular.module("polestar").service("Spec",["_","dl","vl","ZSchema","Alerts","Config","Dataset","Schema",function(e,n,t,a,o,i,l,c){function r(t){for(var a in t)e.isObject(t[a])&&r(t[a]),(null===t[a]||void 0===t[a]||e.isObject(t[a])&&0===n.keys(t[a]).length||t[a]===[])&&delete t[a]}var s={spec:null,chart:{vlSpec:null,encoding:null,shorthand:null,vgSpec:null}};return s._removeEmptyFieldDefs=function(n){n.encoding=e.omit(n.encoding,function(e,a){return!e||void 0===e.field&&void 0===e.value||n.mark&&!t.channel.supportMark(a,n.mark)})},s.parseShorthand=function(e){var n=t.shorthand.parseShorthand(e,null,i.config);s.parseSpec(n)},s.parseSpec=function(e){s.spec=t.util.mergeDeep(s.instantiate(),e)},s.instantiate=function(){return{data:i.data,mark:"point",encoding:e.keys(c.schema.definitions.Encoding.properties).reduce(function(e,n){return e[n]={},e},{}),config:i.config}},s.reset=function(){s.spec=s.instantiate()},s.update=function(l){l=e.cloneDeep(l||s.spec),s._removeEmptyFieldDefs(l),r(l),"encoding"in l||(l.encoding={}),"config"in l||(l.config={});var d=new a;d.setRemoteReference("http://json-schema.org/draft-04/schema",{});var p=c.schema;a.registerFormat("color",function(e){return/^#([0-9a-f]{3}){1,2}$/i.test(e)}),a.registerFormat("font",function(){return!1});var u=d.validate(l,p);if(u){n.extend(l.config,i.large());var f=s.chart;f.fieldSet=s.spec.encoding,f.vlSpec=l,f.cleanSpec=l,f.shorthand=t.shorthand.shorten(l)}else o.add({msg:d.getLastErrors()})},s.reset(),l.onUpdate.push(s.reset),s}]),angular.module("polestar").service("Pills",["consts","vl","Spec","_","$window","Schema","Prov",function(e,n,t,a,o,i,l){function c(){return{}}function r(t,a,l){var r=a.type,s=n.channel.getSupportedRole(l),d=s.dimension&&!s.measure;a.field&&d?"count"===a.aggregate?(a={},o.alert("COUNT not supported here!")):r!==n.type.QUANTITATIVE||a.bin?r!==n.type.TEMPORAL||a.timeUnit||(a.timeUnit=e.defaultTimeFn):(a.aggregate=void 0,a.bin={maxbins:n.bin.MAXBINS_DEFAULT}):a.field||(a={});var p=c(l),u=i.getChannelSchema(l).properties;for(var f in u)a[f]&&("value"===f&&a.field?delete p[f]:p[f]=a[f]);t[l]=p}var s={pills:{}};return s.getSchemaPill=function(e){return{field:e.field,type:e.type,aggregate:e.aggregate}},s.remove=function(e){l.removePill(s.pills[e],e),delete s.pills[e],r(t.spec.encoding,{},e)},s.update=function(e){r(t.spec.encoding,s.pills[e],e)},s.dragStart=function(e,n){s.pills.dragging=e,s.pills.etDragFrom=n},s.dragStop=function(){delete s.pills.dragging},s.dragDrop=function(e){var n=a.clone(t.spec.encoding),o=s.pills.etDragFrom;e!==o&&(o&&r(n,s.pills[o]||{},o),r(n,s.pills[e]||{},e),t.spec.encoding=n,o?l.movePill(s.pills[e],o,e):l.addPill(s.pills[e],e),o=null)},s}]),angular.module("polestar").service("Prov",["$window","vl","consts","dl","Spec",function(e,n,t,a,o){var i=SIMProv.UITrail().addControls().renderTo();i.checkpoint().get(function(){return JSON.parse(JSON.stringify(o.spec))}),i.checkpoint().set(function(e){o.spec=JSON.parse(JSON.stringify(e))});var l=function(e,n){return e=n.spec,JSON.parse(JSON.stringify(e))},c=JSON.parse(JSON.stringify(o.spec)),r=function(e,n,t){return t&&(e=t.spec),JSON.parse(JSON.stringify(e))},s=function(e,n){o.spec=n?JSON.parse(JSON.stringify(n.spec)):JSON.parse(JSON.stringify(c))},d=function(e,n){o.spec=JSON.parse(JSON.stringify(n.spec))},p=i.createAction("addPill",{forward:l,inverse:r,undo:s,redo:d,format:function(e){return'Added "'+e.pill.field+'" to "'+e.dragTo+'"'}}),u=i.createAction("addPill",{forward:l,inverse:r,undo:s,redo:d,format:function(e){return'Removed "'+e.pill.field+'" to "'+e.channel+'"'}}),f=i.createAction("movePill",{forward:l,inverse:r,undo:s,redo:d,format:function(e){return e.pill.field+' moved from "'+e.dragFrom+'" to "'+e.dragTo+'"'}}),g=i.createAction("updatePillFunc",{forward:l,inverse:r,undo:s,redo:d,format:function(e){return'Updated Function of "'+e.pill.field+'" to "'+e.func+'"'}}),m=i.createAction("updateMark",{forward:l,inverse:r,undo:s,redo:d,format:function(e){return'Updated Mark to "'+e.mark+'"'}}),h={};return h.addPill=function(e,n){i.record(p,{pill:e,dragTo:n,spec:o.spec},function(e){h.captureThumbnail(e,800)})},h.movePill=function(e,n,t){i.record(f,{pill:e,dragFrom:n,dragTo:t,spec:o.spec},function(e){h.captureThumbnail(e,800)})},h.removePill=function(e,n){i.record(u,{pill:e,channel:n,spec:o.spec},function(e){h.captureThumbnail(e,800)})},h.updatePillFunc=function(e,n){i.record(g,{pill:e,func:n,spec:o.spec},function(e){h.captureThumbnail(e,800)})},h.updateMark=function(e){i.record(m,{mark:e,spec:o.spec},function(e){h.captureThumbnail(e,800)})},h.canUndo=function(){return null!==i.currentNode().parentNode()},h.canRedo=function(){return i.currentNode().childNodes().length>0},h.undo=function(){i.previous()},h.redo=function(){i.next()},h.loadJSON=function(){i.loadJSON()},h.saveJSON=function(){i.saveJSON()},h.exportGist=function(){i.exportToGist(null,function(e,n){e?alert("Export Failed:\n\n"+e.message):alert("Exported To: "+n.id)})},h.captureThumbnail=function(e,n){setTimeout(function(){var n=d3.select(".vega canvas").node();e.setThumbnail(n.toDataURL())},n)},h.importGist=function(){i.importGist(prompt("Enter gist id"))},h.showGallery=function(){i.openGallery()},h}]),angular.module("polestar").controller("MainCtrl",["$scope","$document","Spec","Dataset","Config","consts","Chronicle","Logger","Bookmarks","Modals","Prov",function(e,n,t,a,o,i,l,c,r,s,d){e.Spec=t,e.Dataset=a,e.Config=o,e.Bookmarks=r,e.consts=i,e.showDevPanel=!1,e.embedded=!!i.embeddedData,e.Prov=d,e.canUndo=!1,e.canRedo=!1,e.canExport=e.canUndo||e.canRedo,e.showModal=function(e){s.open(e)},r.isSupported&&r.load(),e.embedded&&(a.dataset={values:i.embeddedData,name:"embedded"}),a.update(a.dataset).then(function(){o.updateDataset(a.dataset),i.initialSpec&&t.parseSpec(i.initialSpec),e.chron=l.record("Spec.spec",e,!0,["Dataset.dataset","Dataset.dataschema","Dataset.stats","Config.config"]),e.canUndoRedo=function(){e.canUndo=e.Prov.canUndo(),e.canRedo=e.Prov.canRedo(),e.canExport=e.canUndo||e.canRedo},e.chron.addOnAdjustFunction(e.canUndoRedo),e.chron.addOnUndoFunction(e.canUndoRedo),e.chron.addOnRedoFunction(e.canUndoRedo),e.chron.addOnUndoFunction(function(){c.logInteraction(c.actions.UNDO)}),e.chron.addOnRedoFunction(function(){c.logInteraction(c.actions.REDO)}),angular.element(n).on("keydown",function(n){return n.keyCode!=="Z".charCodeAt(0)||!n.ctrlKey&&!n.metaKey||n.shiftKey?n.keyCode==="Y".charCodeAt(0)&&(n.ctrlKey||n.metaKey)?(e.Prov.redo(),e.$digest(),!1):n.keyCode==="Z".charCodeAt(0)&&(n.ctrlKey||n.metaKey)&&n.shiftKey?(e.Prov.redo(),e.$digest(),!1):void 0:(e.Prov.undo(),e.$digest(),!1)})})}]),angular.module("polestar").directive("vlSpecEditor",["Spec",function(e){return{templateUrl:"components/vlSpecEditor/vlSpecEditor.html",restrict:"E",scope:{},link:function(n){n.Spec=e,n.parseShorthand=e.parseShorthand,n.parseVegalite=function(n){e.parseSpec(JSON.parse(n))}}}}]),angular.module("polestar").directive("vgSpecEditor",["Spec",function(e){return{templateUrl:"components/vgSpecEditor/vgSpecEditor.html",restrict:"E",scope:{},link:function(n){n.Spec=e}}}]),angular.module("polestar").directive("shelves",function(){return{templateUrl:"components/shelves/shelves.html",restrict:"E",scope:{},replace:!0,controller:["$scope","vl","Spec","Config","Dataset","Logger","Pills","Prov",function(e,n,t,a,o,i,l,c){e.Spec=t,e.pills=l,e.markChange=function(){c.updateMark(t.spec.mark),i.logInteraction(i.actions.MARK_CHANGE,t.spec.mark)},e.transpose=function(){n.spec.transpose(t.spec)},e.clear=function(){t.reset()},e.$watch("Spec.spec",function(e){i.logInteraction(i.actions.SPEC_CHANGE,e),t.update(e)},!0)}]}}),angular.module("polestar").directive("schemaListItem",["Pills",function(e){return{templateUrl:"components/schemalistitem/schemalistitem.html",restrict:"E",replace:!1,scope:{fieldDef:"="},link:function(n){n.getSchemaPill=e.getSchemaPill,n.fieldDragStart=function(){n.pill=e.getSchemaPill(n.fieldDef),e.dragStart(n.pill,null)},n.fieldDragStop=e.dragStop}}}]),angular.module("polestar").directive("schemaList",["Dataset",function(e){return{templateUrl:"components/schemalist/schemalist.html",restrict:"E",scope:{},replace:!0,controller:["$scope",function(n){n.Dataset=e}]}}]),angular.module("polestar").directive("propertyEditor",function(){return{templateUrl:"components/propertyeditor/propertyeditor.html",restrict:"E",scope:{id:"=",type:"=","enum":"=",propName:"=",group:"=",description:"=","default":"=",min:"=",max:"=",role:"="},link:function(e){e.hasAuto=void 0===e["default"],e.automodel={value:!1},e.hasAuto&&(e.automodel.value=void 0===e.group[e.propName],e.$watch("automodel.value",function(){e.automodel.value===!0&&(e.group[e.propName]=void 0)})),e.isRange=void 0!==e.max&&void 0!==e.min}}}),angular.module("polestar").directive("nullFilterDirective",["Spec",function(e){return{templateUrl:"components/nullfilterdirective/nullfilterdirective.html",restrict:"E",scope:{},link:function(n,t,a){n.Spec=e,n.updateFilter=function(){e.update()}}}}]),angular.module("polestar").directive("lyraExport",function(){return{template:'<a href="#" class="command" ng-click="export()">Export to lyra</a>',restrict:"E",replace:!0,scope:{},controller:["$scope","$timeout","Spec","Alerts",function(e,n,t,a){e["export"]=function(){var e=t.vgSpec;e||a.add("No vega spec present."),e.marks[0]["lyra.groupType"]="layer";var o="http://idl.cs.washington.edu/projects/lyra/app/",i=window.open(o,"_blank");n(function(){a.add("Please check whether lyra loaded the vega spec correctly. This feature is experimental and may not work.",5e3),i.postMessage({spec:e},o)},5e3)}}]}}),angular.module("polestar").directive("jsonInput",["JSON3",function(e){return{restrict:"A",require:"ngModel",scope:{},link:function(n,t,a,o){var i=function(n){return e.stringify(n,null,"  ",80)};o.$formatters.push(i)}}}]),angular.module("polestar").directive("functionSelect",["_","consts","vl","Pills","Logger","Schema","Prov",function(e,n,t,a,o,i,l){return{templateUrl:"components/functionselect/functionselect.html",restrict:"E",scope:{channel:"=",fieldDef:"="},link:function(c){function r(){return a?a.pills[c.channel]:null}function s(e){return"temporal"===e?i.schema.definitions.TimeUnit["enum"]:[]}function d(e){return e?"quantitative"===e?i.schema.definitions.AggregateOp["enum"]:[]:[g]}var p,u="bin",f="",g="count";c.pills=a.pills,c.func={selected:f,list:[f]},c.selectChanged=function(){o.logInteraction(o.actions.FUNC_CHANGE,c.func.selected),l.updatePillFunc(r(),c.func.selected)},c.$watch("func.selected",function(n){var t=r(),o=e.clone(t),i=o?o.type:"";o&&(o.bin=n===u?!0:void 0,o.aggregate=-1!==d(i).indexOf(n)?n:void 0,o.timeUnit=-1!==s(i).indexOf(n)?n:void 0,e.isEqual(t,o)||(a.pills[c.channel]=o,a.update(c.channel)))}),c.$watch("fieldDef",function(e){if(e){var a=e.field?e.type:"";e.bin&&(p=e.bin.maxbins);var o=-1!==["row","column","shape"].indexOf(c.channel),i=a===t.type.QUANTITATIVE,l=a===t.type.TEMPORAL;if("*"===e.field&&e.aggregate===g)c.func.list=[g],c.func.selected=g;else{c.func.list=(o&&(i||l)?[]:[""]).concat(s(a)).concat(d(a).filter(function(e){return e!==g})).concat("quantitative"===a?["bin"]:[]);var r=o&&i&&u||l&&n.defaultTimeFn||f,m=e.bin?"bin":e.aggregate||e.timeUnit||r;c.func.list.indexOf(m)>=0?c.func.selected=m:c.func.selected=r}}},!0)}}}]),angular.module("polestar").directive("configurationEditor",function(){return{templateUrl:"components/configurationeditor/configurationeditor.html",restrict:"E",scope:{},controller:["$scope","Config",function(e,n){e.Config=n}]}}),angular.module("polestar").directive("fieldDefEditor",["Dataset","Pills","_","Drop","Logger","vl","Schema",function(e,n,t,a,o,i,l){return{templateUrl:"components/fielddefeditor/fielddefeditor.html",restrict:"E",replace:!0,scope:{channel:"=",encoding:"=",mark:"="},link:function(c,r){function s(){return n.pills[c.channel]}var d,p;c.allowedCasting={quantitative:[i.type.QUANTITATIVE,i.type.ORDINAL,i.type.NOMINAL],ordinal:[i.type.ORDINAL,i.type.NOMINAL],nominal:[i.type.NOMINAL,i.type.ORDINAL],temporal:[i.type.TEMPORAL,i.type.ORDINAL,i.type.NOMINAL]},c.Dataset=e,c.schema=l.getChannelSchema(c.channel),c.pills=n.pills,c.vl=i,d=new a({content:r.find(".shelf-properties")[0],target:r.find(".shelf-label")[0],position:"bottom left",openOn:"click"}),c.fieldInfoPopupContent=r.find(".shelf-functions")[0],c.removeField=function(){n.remove(c.channel)},c.fieldDragStart=function(){n.dragStart(n[c.channel],c.channel)},c.fieldDragStop=function(){n.dragStop()},c.fieldDropped=function(){var e=s();p&&(p=null);var a=l.schema.definitions.Type["enum"];t.includes(a,e.type)||(e.type=a[0]),n.dragDrop(c.channel),o.logInteraction(o.actions.FIELD_DROP,c.encoding[c.channel])},c.$watch("encoding[channel]",function(e){n.pills[c.channel]=e?t.cloneDeep(e):{},console.log("Updating Channel",n.pills[c.channel])},!0),c.$watchGroup(["allowedCasting[Dataset.dataschema.byName[encoding[channel].field].type]","encoding[channel].aggregate"],function(e){var n=e[0],t=e[1];c.allowedTypes="count"===t?[i.type.QUANTITATIVE]:n})}}}]),angular.module("polestar").run(["$templateCache",function(e){e.put("app/main/main.html",'<div ng-controller="MainCtrl" class="flex-root vflex full-width full-height"><div class="full-width no-shrink"><div class="card top-card no-right-margin no-top-margin"><div class="hflex"><div id="logo"></div><div class="pane"><div class="controls"><a ng-show="Bookmarks.isSupported" class="command" ng-click="showModal(\'bookmark-list\')"><i class="fa fa-bookmark"></i> Bookmarks ({{Bookmarks.length}})</a> <a class="command" ng-click="Prov.undo()" ng-class="{disabled: !canUndo}"><i class="fa fa-undo"></i> Undo</a> <a class="command" ng-click="Prov.redo()" ng-class="{disabled: !canRedo}"><i class="fa fa-repeat"></i> Redo</a> <a class="command" ng-click="Prov.exportGist()" ng-class="{disabled: !canExport}"><i class="fa fa-cloud-upload"></i> Export Gist</a> <a class="command" ng-click="Prov.importGist()"><i class="fa fa-cloud-download"></i> Import Gist</a> <a class="command" ng-click="Prov.saveJSON()" ng-class="{disabled: !canExport}"><i class="fa fa-download"></i> Save</a> <a class="command" ng-click="Prov.loadJSON()"><i class="fa fa-upload"></i> Load</a> <a class="command" ng-click="Prov.showGallery()"><i class="fa fa-archive"></i> Gallery</a></div></div><div class="absolute-top-right"><a href="https://idl.cs.washington.edu/" target="_blank" class="idl-logo"></a></div></div></div><alert-messages></alert-messages></div><div class="hflex full-width main-panel grow-1"><div class="pane data-pane noselect"><div class="card no-top-margin data-card abs-100"><div class="sidebar-header" ng-if="!embedded"><h2>Data</h2><dataset-selector class="right"></dataset-selector><div class="current-dataset" title="{{Dataset.currentDataset.name}}"><i class="fa fa-database"></i> <span class="dataset-name">{{Dataset.currentDataset.name}}</span></div></div><schema-list></schema-list><div id="footer"><ul class="menu"><span ng-show="consts.debug"><li><a class="debug" ng-click="showDevPanel = !showDevPanel">Debug</a></li><li><a ng-href="{{ {spec:Spec.chart.vlSpec} | reportUrl }}" target="_blank" class="debug">Report an issue</a></li></span></ul></div></div></div><div class="pane encoding-pane"><shelves></shelves></div><div class="pane vis-pane"><vl-plot-group class="card abs-100 no-top-margin no-right-margin full-vl-plot-group" chart="Spec.chart" show-bookmark="true" show-filter-null="true" show-log="true" show-mark-type="true" show-sort="true" show-transpose="true" config-set="large" show-label="true" tooltip="true" always-scrollable="true"></vl-plot-group></div></div><div class="hflex full-width dev-panel" ng-if="showDevPanel"><div class="pane config-pane"><div class="card scroll-y abs-100"><configuration-editor></configuration-editor></div></div><div class="pane vl-pane"><vl-spec-editor></vl-spec-editor></div><div class="pane vg-pane"><vg-spec-editor></vg-spec-editor></div></div><bookmark-list highlighted="Fields.highlighted"></bookmark-list><dataset-modal></dataset-modal></div>'),e.put("components/configurationeditor/configurationeditor.html","<form><pre>{{ Config.config | compactJSON }}</pre></form>"),e.put("components/fielddefeditor/fielddefeditor.html",'<div class="shelf-group"><div class="shelf" ng-class="{disabled: !vl.channel.supportMark(channel, mark)}"><div class="shelf-label" ng-class="{expanded: propsExpanded}">{{ channel }}</div><div class="field-drop" ng-model="pills[channel]" data-drop="vl.channel.supportMark(channel, mark)" jqyoui-droppable="{onDrop:\'fieldDropped\'}" data-jqyoui-options="{activeClass: \'drop-active\'}"><field-info ng-show="encoding[channel].field" ng-class="{expanded: funcsExpanded}" field-def="encoding[channel]" show-type="true" show-caret="true" disable-count-caret="true" popup-content="fieldInfoPopupContent" show-remove="true" remove-action="removeField()" class="selected draggable full-width" data-drag="true" ng-model="pills[channel]" jqyoui-draggable="{onStart: \'fieldDragStart\', onStop:\'fieldDragStop\'}" data-jqyoui-options="{revert: \'invalid\', helper: \'clone\'}"></field-info><span class="placeholder" ng-if="!encoding[channel].field">drop a field here</span></div></div><div class="drop-container"><div class="popup-menu shelf-properties shelf-properties-{{channel}}"><div><property-editor ng-show="schema.properties.value" id="channel + \'value\'" type="schema.properties.value.type" enum="schema.properties.value.enum" prop-name="\'value\'" group="encoding[channel]" description="schema.properties.value.description" min="schema.properties.value.minimum" max="schema.properties.value.maximum" role="schema.properties.value.role" default="schema.properties.value.default"></property-editor></div><div ng-repeat="group in [\'legend\', \'scale\', \'text\', \'axis\', \'bin\']" ng-show="schema.properties[group]"><h4>{{ group }}</h4><div ng-repeat="(propName, scaleProp) in schema.properties[group].properties" ng-init="id = channel + group + $index" ng-show="scaleProp.supportedTypes ? scaleProp.supportedTypes[encoding[channel].type] : true"><property-editor id="id" type="scaleProp.type" enum="scaleProp.enum" prop-name="propName" group="encoding[channel][group]" description="scaleProp.description" min="scaleProp.minimum" max="scaleProp.maximum" role="scaleProp.role" default="scaleProp.default"></property-editor></div></div></div><div class="popup-menu shelf-functions shelf-functions-{{channel}}"><div class="mb5"><h4>Types</h4><span ng-if="allowedTypes.length<=1">{{encoding[channel].type}}</span> <label class="type-label" ng-if="allowedTypes.length>1" ng-repeat="type in allowedTypes"><input type="radio" ng-value="type" ng-model="encoding[channel].type"> {{type}}</label></div><function-select field-def="encoding[channel]" channel="channel"></function-select></div></div></div>'),e.put("components/functionselect/functionselect.html",'<div class="mb5" ng-if="func.list.length > 1 || func.list[0] !== \'\'"><h4>Functions</h4><label class="func-label field-func" ng-repeat="f in func.list"><input type="radio" ng-value="f" ng-model="func.selected" ng-change="selectChanged()"> {{f || \'-\'}}</label></div>'),e.put("components/nullfilterdirective/nullfilterdirective.html",'<label><input ng-model="Spec.spec.config.filterNull.O" ng-change="updateFilter()" type="checkbox"> Remove null values</label>'),e.put("components/propertyeditor/propertyeditor.html",'<div><label class="prop-label" for="{{ id }}"><span class="name" title="{{ propName }}">{{ propName }}</span> <span ng-if="description" class="fa fa-info-circle" tooltips="" tooltip-size="small" tooltip-html="<strong>{{ propName }}</strong><div class=\'tooltip-content\'>{{ description }}</div>" tooltip-side="right"></span></label><form class="inline-block" ng-switch="type + (enum !== undefined ? \'list\' : \'\')"><input id="{{ id }}" ng-switch-when="boolean" type="checkbox" ng-model="group[propName]" ng-hide="automodel.value"><select id="{{ id }}" ng-switch-when="stringlist" ng-model="group[propName]" ng-options="choice for choice in enum track by choice" ng-hide="automodel.value"></select><input id="{{ id }}" ng-switch-when="integer" ng-attr-type="{{ isRange ? \'range\' : \'number\'}}" ng-model="group[propName]" ng-model-options="{debounce: 200}" ng-attr-min="{{min}}" ng-attr-max="{{max}}" ng-hide="automodel.value" ng-attr-title="{{ isRange ? group[propName] : undefined }}"> <input id="{{ id }}" ng-attr-type="{{ role === \'color\' ? \'color\' : \'string\' }}" ng-switch-when="string" ng-model="group[propName]" ng-model-options="{debounce: 500}" ng-hide="automodel.value"> <small ng-if="hasAuto"><label>Auto <input ng-model="automodel.value" type="checkbox"></label></small></form></div>'),e.put("components/schemalist/schemalist.html",'<div class="schema no-top-margin full-width"><schema-list-item field-def="fieldDef" ng-repeat="fieldDef in Dataset.dataschema | orderBy : Dataset.fieldOrder"></schema-list-item></div>'),e.put("components/shelves/shelves.html",'<div class="card abs-100"><a class="right" ng-click="clear()"><i class="fa fa-eraser"></i> Clear</a><h2>Encoding</h2><div class="shelf-pane shelf-encoding-pane full-width"><h3>Positional</h3><field-def-editor channel="\'x\'" encoding="Spec.spec.encoding" mark="Spec.spec.mark"></field-def-editor><field-def-editor channel="\'y\'" encoding="Spec.spec.encoding" mark="Spec.spec.mark"></field-def-editor><field-def-editor channel="\'column\'" encoding="Spec.spec.encoding" mark="Spec.spec.mark">></field-def-editor><field-def-editor channel="\'row\'" encoding="Spec.spec.encoding" mark="Spec.spec.mark"></field-def-editor></div><div class="shelf-pane shelf-marks-pane full-width"><div class="right"><select class="markselect" ng-model="Spec.spec.mark" ng-options="type for type in [\'point\', \'tick\', \'bar\', \'line\', \'area\', \'text\']" ng-change="markChange()"></select></div><h3>Marks</h3><field-def-editor channel="\'size\'" encoding="Spec.spec.encoding" mark="Spec.spec.mark"></field-def-editor><field-def-editor channel="\'color\'" encoding="Spec.spec.encoding" mark="Spec.spec.mark"></field-def-editor><field-def-editor channel="\'shape\'" encoding="Spec.spec.encoding" mark="Spec.spec.mark"></field-def-editor><field-def-editor channel="\'detail\'" encoding="Spec.spec.encoding" mark="Spec.spec.mark"></field-def-editor><field-def-editor channel="\'text\'" encoding="Spec.spec.encoding" mark="Spec.spec.mark"></field-def-editor></div></div>'),e.put("components/schemalistitem/schemalistitem.html",'<field-info field-def="fieldDef" show-type="true" show-info="true" class="pill list-item draggable full-width no-right-margin" ng-model="pill" data-drag="true" jqyoui-draggable="{placeholder: \'keep\', deepCopy: true, onStart: \'fieldDragStart\', onStop:\'fieldDragStop\'}" data-jqyoui-options="{revert: \'invalid\', helper: \'clone\'}"></field-info>'),e.put("components/vlSpecEditor/vlSpecEditor.html",'<div class="card scroll-y abs-100 vflex"><div class="subpane no-shrink"><a ng-click="parseShorthand(Spec.chart.shorthand)" class="right command">Load</a><div class="right command"><a ui-zeroclip="" zeroclip-model="Spec.chart.shorthand">Copy</a></div><h3>Vega-Lite Shorthand</h3><input class="shorthand full-width" type="text" ng-model="Spec.chart.shorthand"></div><div class="subpane flex-grow-1 vflex"><div><a ng-click="parseVegalite(Spec.chart.vlSpec)" class="right command">Load</a><div class="right command"><a ui-zeroclip="" zeroclip-model="Spec.chart.cleanSpec | compactJSON">Copy</a></div><h3>Vega-Lite Encoding</h3></div><textarea class="vlspec flex-grow-1 full-height" json-input="" type="text" ng-model="Spec.chart.cleanSpec"></textarea></div></div>'),e.put("components/vgSpecEditor/vgSpecEditor.html",'<div class="card scroll-y abs-100 vflex no-right-margin"><div><div class="right"><a class="command" ui-zeroclip="" zeroclip-model="Spec.chart.vgSpec | compactJSON">Copy</a><lyra-export></lyra-export></div><h3>Vega Specification</h3></div><textarea class="vgspec flex-grow-1" json-input="" disabled="disabled" type="text" ng-model="Spec.chart.vgSpec"></textarea></div>')}]);