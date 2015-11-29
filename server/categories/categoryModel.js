var mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
  name: String
});

var cats = mongoose.model('Category', CategorySchema);
var docArray = ['Arts & Culture',
'Business',
'Living',
'Science & Technology',
'Sports',
'World'];

cats.find()
  .then(function (allCats){
    if (allCats.length < 6){
      for (var i = docArray.length - 1; i >= 0; i--) {
        var name = docArray[i];
        var newCat = new cats({name:name});
        newCat.save();
      }
    }
  });


module.exports = cats;
