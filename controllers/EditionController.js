var Edition = require('../models/edition');
var Editorial = require('../models/editorial');
var Book = require('../models/book');
var Language = require('../models/language');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Edition.
exports.edition_list = function(req, res, next) {

  Edition.find({}, 'title author ')
    .populate('id_editorial')
    .exec(function (err, edition_list) {
      if (err) { return next(err); }
      // Successful, so render
      res.render('edition_list', { title: 'Edition List', edition_list:  edition_list});
    });

};

// Display detail page for a specific Edition.
exports.edition_detail = function(req, res, next) {
    
  async.parallel({
      editions: function(callback) {

          Edition.findById(req.params.id)
            .populate('language')
            .populate('editorial')
            .exec(callback);
      },
      book_instance: function(callback) {

        BookInstance.find({ 'book': req.params.id })
        .exec(callback);
      },
  }, function(err, results) {
      if (err) { return next(err); }
      if (results.edition==null) { // No results.
          var err = new Error('Edition not found');
          err.status = 404;
          return next(err);
      }
      // Successful, so render.
      res.render('edition_detail', { title: 'Title', edition:  results.edition, book_instances: results.book_instance } );
  });

};

// Display Edition create form on GET.
exports.edition_create_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Edition create GET');
};

// Handle Edition create on POST.
exports.edition_create_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Edition create POST');
};

// Display Edition delete form on GET.
exports.edition_delete_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Edition delete GET');
};

// Handle Edition delete on POST.
exports.edition_delete_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Edition delete POST');
};

// Display Edition update form on GET.
exports.edition_update_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Edition update GET');
};

// Handle Edition update on POST.
exports.edition_update_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Edition update POST');
};