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
 
  var whatType = function() {
    var checked = Array.from(radios).find(function(e) { return $(e).is(':checked') });
    return $(checked).attr('value');
  };
  var switchRadio = function() {
    var rs  = Array.from(radios);
    var i = rs.findIndex(function(e) { return $(e).is(':checked') });
    var next = (i + 1) % 4;
    rs.forEach(function(e, i) { $(e).prop('checked', i === next)});
  }
  
  // functions iterate
  var lines = {
    horizontal: [[0,1,2,3], [4,5,6,7], [8,9,10,11], [12,13,14,15]],
    vertical:   [[0,4,8,12], [1,5,9,13], [2,6,10,14], [3,7,11,15]],
    diagonalLeft:  [[4,1], [8,5,2], [12,9,6,3], [13,10,7], [14,11]],
    diagonalRight: [[7,2], [11,6,1], [15,10,5,0], [14,9,4], [13,8]]
  }
  
  var getInputValues = function() {
    return inputs.map(function(i,e) { return parseInt($(e).val()) || 0 });
  }
  var getValues = function() {
    return labels.map(function(i,e) { return parseFloat($(e).text()) || 0 });
  }
  
  var iterate = function() {
    var model = getInputValues();
    var idxsGroup = lines[whatType()];
    
    var sumReducer = function(acc, i) { return acc + model[i]; };
    var sums = idxsGroup.map(function(idxs) { return idxs.reduce(sumReducer, 0) });
    console.log(sums);
    switchRadio();
  };
  
  // subscribers
  bResetClick.subscribe(resetAll);
  inputsKeyup.subscribe(resetLabels)
  bIterClick.subscribe(iterate);
});