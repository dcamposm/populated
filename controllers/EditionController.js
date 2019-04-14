var Edition = require('../models/edition');
var Editorial = require('../models/editorial');
var Book = require('../models/book');
var Language = require('../models/language');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var async = require('async');
// Display list of all Edition.
exports.edition_list = function(req, res, next) {

  Edition.find({}, 'editorial book year' )
    .populate('editorial')
    .populate('book')
  	.sort( { 'book': 1 } )
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
            .populate('editorial')
            .populate('book')
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
      res.render('edition_detail', { title: 'Title', edition:  results.edition } );
  });

};

// Display Edition create form on GET.
exports.edition_create_get = function(req, res, next) {

    // Get all editorials, books and languages, which we can use for adding to our edition.
    async.parallel({
        editorials: function(callback) {
            Editorial.find(callback);
        },
        books: function(callback) {
            Book.find(callback);
        },
        languages: function(callback) {
            Language.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('edition_form', {
        		title: 'Create Edition',
        		editorials: results.editorials,
        		books: results.books,
        		languages: results.languages
    		});
    });
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