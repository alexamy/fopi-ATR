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
  var bIterClick  = fromEvent(bIter,  'click');
  var bResetClick = fromEvent(bReset, 'click');
  var inputsKeyup = merge.apply(this, inputs.map(function(i,e) { return fromEvent(e, 'keyup'); }));
  
  // functions helper
  var resetLabels = function() {
    labels.each(function(i,e) { $(e).text(''); });
  };
  var resetAll = function() {
    inputs.each(function(i,e) { $(e).val(''); });
    resetLabels();
  };
  
  // functions iterate
  var whatType = function() {
    var checked = Array.from(radios).find(function(e) { return $(e).is(':checked') });
    return $(checked).attr('value');
  };
  var getInputValues = function() {
    return inputs.map(function(i,e) { return parseInt($(e).val()) || 0 });
  }
  var getValues = function() {
    return labels.map(function(i,e) { return parseInt($(e).text()) || 0 });
  }
  
  var iterate = function() {
    console.log(getInputValues());
  };
  
  // subscribers
  bResetClick.subscribe(resetAll);
  inputsKeyup.subscribe(resetLabels);
  bIterClick.subscribe(iterate);
});