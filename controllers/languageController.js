var Language = require('../models/language');
var Book = require('../models/book');
var async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
// Display list of all Language.
exports.language_list = function(req, res, next) {

    Language.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_languages) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('language_list', { title: 'Language List', language_list:  list_languages});
    });

};

// Display detail page for a specific Language.
exports.language_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Language detail: ' + req.params.id);
};

// Display Language create form on GET.
exports.language_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Language create GET');
};

// Handle Language create on POST.
exports.language_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Language create POST');
};

// Display Language delete form on GET.
exports.language_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Language delete GET');
};

// Handle Language delete on POST.
exports.language_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Language delete POST');
};

// Display Language update form on GET.
exports.language_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Language update GET');
};

// Handle Language update on POST.
exports.language_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Language update POST');
};