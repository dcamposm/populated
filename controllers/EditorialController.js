var Editorial = require('../models/editorial');
var Country = require('../models/country')
var async = require('async');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
// Display list of all Editorial.
exports.editorial_list = function(req, res) {
    Editorial.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_editorials) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('editorial_list', { title: 'Editorial List', editorial_list:  list_editorials});
    });
};

// Display detail page for a specific Editorial.
exports.editorial_detail = function(req, res) {
    async.parallel({
        editorial: function(callback) {

            Editorial.findById(req.params.id)
            	.populate('country')
              	.exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.editorial==null) { // No results.
            var err = new Error('Editorial not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('editorial_detail', { title: 'Editorial Detail', editorial: results.editorial } );
    });
};

// Display Editorial create form on GET.
exports.editorial_create_get = function(req, res) {
	async.parallel({
        countries: function(callback) {
            Country.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        //console.log(results.countries);
        res.render('editorial_form', { title: 'Create Editorial', countries:results.countries });
    });
};

// Handle Editorial create on POST.
exports.editorial_create_post = function(req, res) {
   // Validate fields.
    body('name', 'Genre name required').isLength({ min: 1 }).trim(),
    body('country', 'Country must not be empty.').isLength({ min: 1 }).trim(),

    // Sanitize fields.
    sanitizeBody('name').escape(),
    sanitizeBody('country').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
        
        // Create Editorial object with escaped and trimmed data
        var editorial = new Editorial(
            {
                name: req.body.name,
                country: req.body.country
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('editorial', { title: 'Create Editorial', editorial: editorial, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Save editorial.
            editorial.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new editorial record.
                res.redirect(editorial.url);
            });
        }
    }
};

// Display Editorial delete form on GET.
exports.editorial_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Editorial delete GET');
};

// Handle Editorial delete on POST.
exports.editorial_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Editorial delete POST');
};

// Display Editorial update form on GET.
exports.editorial_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Editorial update GET');
};

// Handle Editorial update on POST.
exports.editorial_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Editorial update POST');
};