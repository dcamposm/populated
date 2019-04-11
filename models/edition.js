var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var EditionSchema = new Schema(
  {
    book: {type: Schema.Types.ObjectId, ref: 'Book', required: true},
    editorial: {type: Schema.Types.ObjectId, ref: 'Editorial', required: true},
    year: {type: Date},
    language: [{type: Schema.Types.ObjectId, ref: 'Language'}]
  }
);

EditionSchema
.virtual('year_formatted')
.get(function () {
  return this.year ? moment(this.year).format('YYYY-MM-DD') : 'Sin información';
});

// Virtual for edition's URL
EditionSchema
.virtual('url')
.get(function () {
  return '/catalog/edition/' + this._id;
});

//Export model
module.exports = mongoose.model('Edition', EditionSchema);