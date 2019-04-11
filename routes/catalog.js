var express = require('express');
var router = express.Router();

// Require controller modules.
var book_controller = require('../controllers/bookController');
var author_controller = require('../controllers/authorController');
var genre_controller = require('../controllers/genreController');
var book_instance_controller = require('../controllers/bookinstanceController');
var country_controller = require('../controllers/countryController');
var edition_controller = require('../controllers/editionController');
var editorial_controller = require('../controllers/editorialController');
var language_controller = require('../controllers/languageController');
/// BOOK ROUTES ///

// GET catalog home page.
router.get('/', book_controller.index);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/book/create', book_controller.book_create_get);

// POST request for creating Book.
router.post('/book/create', book_controller.book_create_post);

// GET request to delete Book.
router.get('/book/:id/delete', book_controller.book_delete_get);

// POST request to delete Book.
router.post('/book/:id/delete', book_controller.book_delete_post);

// GET request to update Book.
router.get('/book/:id/update', book_controller.book_update_get);

// POST request to update Book.
router.post('/book/:id/update', book_controller.book_update_post);

// GET request for one Book.
router.get('/book/:id', book_controller.book_detail);

// GET request for list of all Book items.
router.get('/books', book_controller.book_list);

/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get('/author/create', author_controller.author_create_get);

// POST request for creating Author.
router.post('/author/create', author_controller.author_create_post);

// GET request to delete Author.
router.get('/author/:id/delete', author_controller.author_delete_get);

// POST request to delete Author.
router.post('/author/:id/delete', author_controller.author_delete_post);

// GET request to update Author.
router.get('/author/:id/update', author_controller.author_update_get);

// POST request to update Author.
router.post('/author/:id/update', author_controller.author_update_post);

// GET request for one Author.
router.get('/author/:id', author_controller.author_detail);

// GET request for list of all Authors.
router.get('/authors', author_controller.author_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genre/create', genre_controller.genre_create_get);

//POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post);

// GET request to delete Genre.
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// GET request to update Genre.
router.get('/genre/:id/update', genre_controller.genre_update_get);

// POST request to update Genre.
router.post('/genre/:id/update', genre_controller.genre_update_post);

// GET request for one Genre.
router.get('/genre/:id', genre_controller.genre_detail);

// GET request for list of all Genre.
router.get('/genres', genre_controller.genre_list);

/// BOOKINSTANCE ROUTES ///

// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
router.get('/bookinstance/create', book_instance_controller.bookinstance_create_get);

// POST request for creating BookInstance. 
router.post('/bookinstance/create', book_instance_controller.bookinstance_create_post);

// GET request to delete BookInstance.
router.get('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_get);

// POST request to delete BookInstance.
router.post('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_post);

// GET request to update BookInstance.
router.get('/bookinstance/:id/update', book_instance_controller.bookinstance_update_get);

// POST request to update BookInstance.
router.post('/bookinstance/:id/update', book_instance_controller.bookinstance_update_post);

// GET request for one BookInstance.
router.get('/bookinstance/:id', book_instance_controller.bookinstance_detail);

// GET request for list of all BookInstance.
router.get('/bookinstances', book_instance_controller.bookinstance_list);

/// COUNTRY ROUTES ///

// GET request for creating a Country. NOTE This must come before route that displays Country (uses id).
router.get('/country/create', country_controller.country_create_get);

// POST request for creating Country. 
router.post('/country/create', country_controller.country_create_post);

// GET request to delete Country.
router.get('/country/:id/delete', country_controller.country_delete_get);

// POST request to delete Country.
router.post('/country/:id/delete', country_controller.country_delete_post);

// GET request to update Country.
router.get('/country/:id/update', country_controller.country_update_get);

// POST request to update Country.
router.post('/country/:id/update', country_controller.country_update_post);

// GET request for one Country.
router.get('/country/:id', country_controller.country_detail);

// GET request for list of all Country.
router.get('/countries', country_controller.country_list);

/// EDITION ROUTES ///

// GET request for creating a Edition. NOTE This must come before route that displays Edition (uses id).
router.get('/edition/create', edition_controller.edition_create_get);

// POST request for creating Edition. 
router.post('/edition/create', edition_controller.edition_create_post);

// GET request to delete Edition.
router.get('/edition/:id/delete', edition_controller.edition_delete_get);

// POST request to delete Edition.
router.post('/edition/:id/delete', edition_controller.edition_delete_post);

// GET request to update Edition.
router.get('/edition/:id/update', edition_controller.edition_update_get);

// POST request to update Edition.
router.post('/edition/:id/update', edition_controller.edition_update_post);

// GET request for one Edition.
router.get('/edition/:id', edition_controller.edition_detail);

// GET request for list of all Edition.
router.get('/editions', edition_controller.edition_list);

/// EDITORIAL ROUTES ///

// GET request for creating a Editorial. NOTE This must come before route that displays Editorial (uses id).
router.get('/editorial/create', editorial_controller.editorial_create_get);

// POST request for creating Editorial. 
router.post('/editorial/create', editorial_controller.editorial_create_post);

// GET request to delete Editorial.
router.get('/editorial/:id/delete', editorial_controller.editorial_delete_get);

// POST request to delete Editorial.
router.post('/editorial/:id/delete', editorial_controller.editorial_delete_post);

// GET request to update Editorial.
router.get('/editorial/:id/update', editorial_controller.editorial_update_get);

// POST request to update Editorial.
router.post('/editorial/:id/update', editorial_controller.editorial_update_post);

// GET request for one Editorial.
router.get('/editorial/:id', editorial_controller.editorial_detail);

// GET request for list of all Editorial.
router.get('/editorials', editorial_controller.editorial_list);

/// LANGUAGE ROUTES ///

// GET request for creating a Language. NOTE This must come before route that displays Language (uses id).
router.get('/language/create', language_controller.language_create_get);

// POST request for creating Language. 
router.post('/language/create', language_controller.language_create_post);

// GET request to delete Language.
router.get('/language/:id/delete', language_controller.language_delete_get);

// POST request to delete Language.
router.post('/language/:id/delete', language_controller.language_delete_post);

// GET request to update Language.
router.get('/language/:id/update', language_controller.language_update_get);

// POST request to update Language.
router.post('/language/:id/update', language_controller.language_update_post);

// GET request for one Language.
router.get('/language/:id', language_controller.language_detail);

// GET request for list of all Language.
router.get('/languages', language_controller.language_list);

module.exports = router;