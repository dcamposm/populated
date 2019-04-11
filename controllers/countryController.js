var Country = require('../models/country');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
// Display list of all Country.
exports.country_list = function(req, res, next) {

    Country.find()
        .sort([['name', 'ascending']])
        .exec(function (err, list_countrys) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('country_list', { title: 'Country List', country_list:  list_countrys});
        });

};

// Display detail page for a specific Country.
exports.country_detail = function(req, res, next) {

    async.parallel({
        country: function(callback) {
            Country.findById(req.params.id)
                .exec(callback);
        },

        country_authors: function(callback) {
            Author.find({ 'country': req.params.id })
                .exec(callback);
        },

        country_editorials: function(callback) {
            Editorial.find({ 'country': req.params.id })
                .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.country==null) { // No results.
            var err = new Error('Country not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('country_detail', 
                {
                    title: 'Country Detail',
                    country: results.country,
                    country_authors: results.country_authors,
                    country_editorials: results.country_editorials
                }
            );
    });

};

// Display Country create form on GET.
exports.country_create_get = function(req, res, next) {
    res.render('country_form', { title: 'Create country'});
};

// Handle Country create on POST.
exports.country_create_post = [

    // Validate that the name field is not empty.
    body('name', 'Country name required').isLength({ min: 1 }).trim(),

    // Sanitize (trim) the name field.
    sanitizeBody('name').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a country object with escaped and trimmed data.
        var country = new Country(
          { name: req.body.name }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('country_form', { title: 'Create Country', country: country, errors: errors.array()});

            return;
        }
        else {
            // Data from form is valid.
            // Check if Country with same name already exists.
            Country.findOne({ 'name': req.body.name })
                .exec( function(err, found_country) {
                     if (err) { return next(err); }

                     if (found_country) {
                         // Country exists, redirect to its detail page.
                         res.redirect(found_country.url);
                     }
                     else {

                         country.save(function (err) {
                           if (err) { return next(err); }
                           // Country saved. Redirect to country detail page.
                           res.redirect(country.url);
                         });

                     }

                 });
        }
    }
];

// Display Country delete form on GET.
exports.country_delete_get = function(req, res, next) {

    async.parallel({
        country: function(callback) {
            Genre.findById(req.params.id).exec(callback);
        },
        country_books: function(callback) {
            Book.find({ 'country': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.country_books.length > 0) {
            // Country has books. Render in same way as for GET route.
            res.render('country_delete', { title: 'Delete Country', country: results.country, country_books: results.country_books } );
            return;
        }
        else {
            // Country has no books. Delete object and redirect to the list of countries.
            Country.findByIdAndRemove(req.body.id, function deleteGenre(err) {
                if (err) { return next(err); }
                // Success - go to countries list.
                res.redirect('/catalog/countries');
            });

        }
    });
};

// Handle Country delete on POST.
exports.country_delete_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Country delete POST');
};

// Display Country update form on GET.
exports.country_update_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Country update GET');
};

// Handle Country update on POST.
exports.country_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Language update POST');
};