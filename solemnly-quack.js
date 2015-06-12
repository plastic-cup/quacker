module.exports = promise;

function promise(){
  var onHappen = [];
  var onBadden = [];

  return {
    on: function(happening, callback){
      if (happening === 'happen') onHappen.push(callback);
      else if (happening === 'badden') onBadden.push(callback);
      else return new Error('what are you doing?');
    },

    happy: function(result){
      onHappen.forEach(function(triumph){triumph(result);});
    },

    baddy: function(result){
      onBadden.forEach(function(tragedy){tragedy(result);});
    },

    reckoning: function(outcome, goodness){
      if (goodness) happy(outcome);
      else baddy(outcome);
    }
  };
}
