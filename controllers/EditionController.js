var Edition = require('../models/edition');
var Editorial = require('../models/editorial');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Edition.
exports.edition_list = function(req, res, next) {

  Edition.find({}, 'editorial' )
    .populate('editorial')
    .exec(function (err, edition_list) {
      if (err) { return next(err); }
      // Successful, so render
      res.render('edition_list', { title: 'Edition List', edition_list:  edition_list});
    });

};

// Display detail page for a specific Edition.
exports.edition_detail = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Edition detail: ' + req.params.id);
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