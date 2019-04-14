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
      edition: function(callback) {

          Edition.findById(req.params.id)
            .populate('editorial')
            .populate('book')
            .populate('language')
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
          { book: req.body.book,
            editorial: req.body.editorial,
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
    
  async.parallel({
      edition: function(callback) {
          Edition.findById(req.params.id).populate('editorial').populate('book').populate('language').exec(callback);
      },
  }, function(err, results) {
      if (err) { return next(err); }
      if (results.edition==null) { // No results.
          res.redirect('/catalog/edition');
      }
      // Successful, so render.
      res.render('edition_delete', { title: 'Delete Edition', edition: results.edition } );
  });

};

// Handle Edition delete on POST.
exports.edition_delete_post = function(req, res, next) {

    async.parallel({
        edition: function(callback) {
            Edition.findById(req.body.id).populate('editorial').populate('book').populate('language').exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        else {
            Edition.findByIdAndRemove(req.body.id, function deleteEdition(err) {
                if (err) { return next(err); }
                // Success - got to edition list.
                res.redirect('/catalog/editions');
            });

        }
    });

};

// Display Edition update form on GET.
exports.edition_update_get = function(req, res, next) {
    
    // Get book, authors and genres for form.
    async.parallel({
        edition: function(callback) {
            Edition.findById(req.params.id).populate('editorial').populate('book').populate('language').exec(callback);
        },
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
            if (results.edition==null) { // No results.
                var err = new Error('Edition not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            // Mark our selected genres as checked.
            for (var all_g_iter = 0; all_g_iter < results.languages.length; all_g_iter++) {
                for (var edition_g_iter = 0; edition_g_iter < results.edition.language.length; edition_g_iter++) {
                    if (results.languages[all_g_iter]._id.toString()==results.edition.language[edition_g_iter]._id.toString()) {
                        results.languages[all_g_iter].checked='true';
                    }
                }
            }
            res.render('edition_form', { title: 'Update Edition', editorials:results.editorials, books:results.books,languages:results.languages, edition: results.edition });
        });
};

// Handle Edition update on POST.
exports.edition_update_post = [

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
    sanitizeBody('editorial').escape(),
    sanitizeBody('book').escape(),
    sanitizeBody('year').escape(),
    sanitizeBody('language.*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped/trimmed data and old id.
        var edition = new Edition(
          { book: req.body.book,
            editorial: req.body.editorial,
            year: req.body.year,
            language: (typeof req.body.language==='undefined') ? [] : req.body.language,
            _id:req.params.id // This is required, or a new ID will be assigned!
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and languages for form
            async.parallel({
                books: function(callback) {
                    Book.find(callback);
                },
                editorials: function(callback) {
                    Editorial.find(callback);
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
                res.render('edition_form', { title: 'Update Edition',books:results.books, editorials:results.editorials, languages:results.languages,edition: edition, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Edition.findByIdAndUpdate(req.params.id, edition, {}, function (err,thebook) {
                if (err) { return next(err); }
                   // Successful - redirect to book detail page.
                   res.redirect(edition.url);
                });
        }
    }
];
