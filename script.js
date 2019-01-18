$(document).ready(function() {
  // defs
  var fromEvent = rxjs.fromEvent;
  var pipe      = rxjs.pipe;
  var merge     = rxjs.merge;
  var o         = rxjs.operators;
  
  // elements
  var inputID = $('.student-id__input');
  var inputs  = $('.inputs-table__input');
  var labels  = $('.results-table__label');
  
  var radios    = $('.radios__radio');
  var errorInfo = $('.error-info__value');
  
  var bIter    = $('.buttons__iterate');
  var bNextDir = $('.buttons__next-dir');
  var bReset   = $('.buttons__reset');

  // streams 
  var bIterClick    = fromEvent(bIter, 'click');
  var bNextDirClick = fromEvent(bNextDir, 'click');
  var bResetClick   = fromEvent(bReset, 'click');
  var inputsKeyup   = merge.apply(this, inputs.map(function(i,e) { return fromEvent(e, 'keyup'); }));
  var inputIdKeyup  = fromEvent(inputID, 'keyup');
  var inputsUp      = merge(inputsKeyup, inputIdKeyup);
  
  // functions helper
  var resetLabels = function() {
    labels.each(function(i,e) { $(e).val(''); });
    errorInfo.text('');
  };
  var resetID = function() { inputID.val(''); };
  var resetAll = function() {
    resetID();
    resetLabels();
    inputs.each(function(i,e) { $(e).val(''); });
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
  
  var fillModel = function() {
    var syms = inputID.val().split('');
    inputs.each(function(i,e) { $(e).val(syms[i%syms.length])});
  }
  var calculateSums = function() {}
  
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
    return labels.map(function(i,e) { return parseFloat($(e).val()) || 0 });
  }
  var sumReducer = function (acc, i) { return acc + i; };
  var sumIdxReducer = function(numbers) { return function(acc, i) { return acc + numbers[i]; } };
  
  var iterateIdxs = function(model, approx) { return function(idxs) {
    var modelSum  = idxs.reduce(sumIdxReducer(model), 0);
    var approxSum = idxs.reduce(sumIdxReducer(approx), 0);
    var delta = modelSum - approxSum;
    var k = delta / idxs.length;
    idxs.forEach(function(i) { approx[i] += k; });
  }};
   
  var calculateError = function() {
    var model  = Array.from(getInputValues());
    var approx = Array.from(getValues());
    var modules = model.map(function(n,i) { return Math.pow(n - approx[i], 2); });
    var idxs    = model.map(function(n,i) { return Math.pow(i+1, 2); });
    return Math.sqrt(modules.reduce(sumReducer, 0) / idxs.reduce(sumReducer, 0));
  };
  var iterate = function() {
    var model  = getInputValues();
    var approx = getValues();
    var idxsGroup = lines[whatType()];
    idxsGroup.forEach(iterateIdxs(model, approx));
    labels.each(function(i, e) { $(e).val(approx[i].toFixed(2)); });
    
    var error = calculateError();
    errorInfo.text((error*100).toFixed(2) + '%');
  };
  
  // subscribers
  inputIdKeyup.subscribe(fillModel);
  inputsKeyup.subscribe(resetID);
  
  inputsUp.subscribe(resetLabels);
  inputsUp.subscribe(calculateSums);
  
  bIterClick.subscribe(iterate);
  bNextDirClick.subscribe(switchRadio);
  bResetClick.subscribe(resetAll);
});