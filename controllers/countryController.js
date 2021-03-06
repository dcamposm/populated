var Country = require('../models/country');
var Author = require('../models/author');
var Editorial = require('../models/editorial');
var async = require('async');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const paginate = require('express-paginate');

// Display list of all Country.
exports.country_list = function(req, res, next) {

    Country.find()
        .limit(req.query.limit)
        .skip(req.skip)
        .sort([['name', 'ascending']])
        .exec(async function (err, list_countrys) {
            if (err) { return next(err); }
            var [itemCount ] = await Promise.all([
              Country.count({})
            ]);

            var pageCount = Math.ceil(itemCount / req.query.limit);
            // Successful, so render.
            res.render('country_list', { title: 'Country List', country_list:  list_countrys,
                pageCount,
                itemCount,
                pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)});
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
            Country.findById(req.params.id).exec(callback);
        },
        country_authors: function(callback) {
            Author.find({ 'country': req.params.id }).exec(callback);
        },
        country_editorials: function(callback) {
            Editorial.find({ 'country': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.country==null) { // No results.
            res.redirect('/catalog/countries');
        }
        // Successful, so render.
        res.render('country_delete', { 
                    title: 'Delete Country',
                    country: results.country,
                    country_authors: results.country_authors,
                    country_editorials: results.country_editorials
                });
    });

};

// Handle Country delete on POST.
exports.country_delete_post = function(req, res, next) {
    async.parallel({
        country: function(callback) {
            Country.findById(req.params.id).exec(callback);
        },
        country_authors: function(callback) {
            Author.find({ 'country': req.params.id }).exec(callback);
        },
        country_editorials: function(callback) {
            Editorial.find({ 'country': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success ///////////////////////////////////////////////////////////// si n0o hay autores ni editoriales
        if ( ( results.country_authors.length > 0 ) || ( results.country_editorials.length > 0 ) ) {
            // Country has books. Render in same way as for GET route.
            res.render('country_delete', {
                        title: 'Delete Country',
                        country: results.country,
                        country_authors: results.country_authors,
                        country_editorials: results.country_editorials
                    });
            return;
        }
        else {
            // Country has no books. Delete object and redirect to the list of countries.
            Country.findByIdAndRemove(req.body.id, function deleteCountry(err) {
                if (err) { return next(err); }
                // Success - go to countries list.
                res.redirect('/catalog/countries');
            });

        }
    });
};

// Display Country update form on GET.
exports.country_update_get = function(req, res, next) {

    Country.findById(req.params.id, function(err, country) {
        if (err) { return next(err); }
        if (country==null) { // No results.
            var err = new Error('Country not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('country_form', { title: 'Update Country', country: country });
    });
    
};

// Handle Country update on POST.
exports.country_update_post = [
   
    // Validate that the name field is not empty.
    body('name', 'Country name required').isLength({ min: 1 }).trim(),
    
    // Sanitize (escape) the name field.
    sanitizeBody('name').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

    // Create a country object with escaped and trimmed data (and the old id!)
        var country = new Country(
          {
          name: req.body.name,
          _id: req.params.id
          }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('genre_form', { title: 'Update Country', country: country, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid. Update the record.
            Country.findByIdAndUpdate(req.params.id, country, {}, function (err,thegenre) {
                if (err) { return next(err); }
                   // Successful - redirect to country detail page.
                   res.redirect(thegenre.url);
                });
        }
    }
];