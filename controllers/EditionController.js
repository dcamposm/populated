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
        console.log(results.books);
        res.render('edition_form', {
        		title: 'Create Edition',
        		editorials: results.editorials,
        		books: results.books,
        		languages: results.languages
    		});
    });
};

// Handle Edition create on POST.
exports.edition_create_post = [
    // Convert the language to an array.
    (req, res, next) => {
        if(!(req.body.language instanceof Array)){
            if(typeof req.body.language==='undefined')
            req.body.language=[];
            else
            req.body.language=new Array(req.body.language);
        }
        next();
    },

    // Validate fields.
    body('editorial', 'Editorial must not be empty.').isLength({ min: 1 }).trim(),
    body('book', 'Book must not be empty.').isLength({ min: 1 }).trim(),
    body('year', 'Year must not be empty.').isLength({ min: 1 }).trim(),
  
    // Sanitize fields.
    sanitizeBody('*').escape(),
    sanitizeBody('language.*').escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
        

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Edition object with escaped and trimmed data.
        var edition = new Edition(
          { editorial: req.body.editorial,
            book: req.body.book,
            year: req.body.year,
            language: req.body.language
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and editions for form.
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

                // Mark our selected languages as checked.
                for (let i = 0; i < results.languages.length; i++) {
                    if (edition.language.indexOf(results.languages[i]._id) > -1) {
                        results.languages[i].checked='true';
                    }
                }
                res.render('book_form', { title: 'Create Edition',editorials:results.editorials,books:results.books, languages:results.languages, edition: edition, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save book.
            edition.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new book record.
                   res.redirect(edition.url);
                });
        }
    }
];


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