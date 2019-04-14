var Edition = require('../models/edition');
var Editorial = require('../models/editorial');
var Book = require('../models/book');
var Language = require('../models/language');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const paginate = require('express-paginate');
var async = require('async');
// Display list of all Edition.
exports.edition_list = function(req, res, next) {

  Edition.find({}, 'editorial book year' )
  	.limit(req.query.limit)
    .skip(req.skip)
    .populate('editorial')
    .populate('book')
    .exec(async function (err, edition_list) {
      	if (err) { return next(err); }
      	var [itemCount ] = await Promise.all([
          Edition.count({})
        ]);

        var pageCount = Math.ceil(itemCount / req.query.limit);
      // Successful, so render
      res.render('edition_list', { title: 'Edition List', edition_list:  edition_list,
            pageCount,
            itemCount,
            pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)});
    });
};

// Display detail page for a specific Edition.
exports.edition_detail = function(req, res, next) {
    
  async.parallel({
      edition: function(callback) {

          Edition.findById(req.params.id)
            .populate('editorial')
            .populate('book')
            .populate('language')
            .exec(callback);
      },
      book_instance: function(callback) {

        BookInstance.find({ 'book': req.params.id })
        .exec(callback);
      },
  }, function(err, results) {
      if (err) { return next(err); }
      if (results.book==null) { // No results.
          var err = new Error('Book not found');
          err.status = 404;
          return next(err);
      }
      // Successful, so render.
      res.render('book_detail', { title: 'Title', book:  results.book, book_instances: results.book_instance } );
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