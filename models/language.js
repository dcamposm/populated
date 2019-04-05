var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LanguageSchema = new Schema(
  {
    name: {type: String, required: true, max: 100},
  }
);

// Virtual for language's URL
LanguageSchema
.virtual('url')
.get(function () {
  return '/catalog/language/' + this._id;
});

//Export model
module.exports = mongoose.model('Language', LanguageSchema);