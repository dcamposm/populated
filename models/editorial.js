var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EditorialSchema = new Schema(
  {
    name: {type: String, required: true, max: 100},
    country: {type: Schema.Types.ObjectId, ref: 'Country', required: true},
  }
);

// Virtual for editorial's URL
EditorialSchema
.virtual('url')
.get(function () {
  return '/catalog/editorial/' + this._id;
});

//Export model
module.exports = mongoose.model('Editorial', EditorialSchema);