$(document).ready(function() {
  // defs
  var fromEvent = rxjs.fromEvent;
  var pipe      = rxjs.pipe;
  var merge     = rxjs.merge;
  var o         = rxjs.operators;
  
  // elements
  var inputs = $('.inputs-table__input');
  var labels = $('.results-table__label');
  var radios = $('.radios__radio');
  var bIter  = $('.buttons__iterate');
  var bReset = $('.buttons__reset');

  // streams 
  var bResetClick  = fromEvent(bReset, 'click');
  var inputsKeyup = merge.apply(this, inputs.map(function(i,e) { return fromEvent(e, 'keyup'); }));
  
  // functions
  var resetLabels = function() {
    labels.each(function(i,e) { $(e).text(''); });
  };
  var resetAll = function() {
    inputs.each(function(i,e) { $(e).val(''); });
    resetLabels();
  };
  
  // subscribers
  bResetClick.subscribe(resetAll);
  inputsKeyup.subscribe(resetLabels);
});