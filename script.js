

$(document).ready(function() {
  // elements
  var inputs = $('.inputs-table__input');
  var labels = $('.results-table__label');
  var radios = $('.radios__radio');
  var bIter  = $('.buttons__iterate');
  var bReset = $('.buttons__reset');

  // streams 
  var bResetClick = rxjs.fromEvent(bReset, 'click');
  
  // functions
  var resetAll = function() {
    inputs.each(function(i,e) { $(e).val(''); });
    labels.each(function(i,e) { $(e).text(''); });
  };
  
  // subscribers
  bResetClick.subscribe(resetAll);
});