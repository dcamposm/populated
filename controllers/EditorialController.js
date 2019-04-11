var Editorial = require('../models/editorial');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
// Display list of all Editorial.
exports.editorial_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Editorial list');
};

// Display detail page for a specific Editorial.
exports.editorial_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Editorial detail: ' + req.params.id);
};

// Display Editorial create form on GET.
exports.editorial_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Editorial create GET');
};

// Handle Editorial create on POST.
exports.editorial_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Editorial create POST');
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