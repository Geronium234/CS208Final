var express = require('express');
var router = express.Router();

var COMMENTS_PER_PAGE = 10;

function loadCommentsPage(req, res, next, currentPage) {
  var pageNumber = currentPage || 1;
  var offset = (pageNumber - 1) * COMMENTS_PER_PAGE;

  req.db.query('SELECT COUNT(*) AS total FROM todos;', (countErr, countResults) => {
    if (countErr) {
      console.error('Error counting todos:', countErr);
      return res.status(500).send('Error fetching todos');
    }

    var totalComments = countResults[0].total;
    var totalPages = Math.max(1, Math.ceil(totalComments / COMMENTS_PER_PAGE));
    if (pageNumber > totalPages) {
      pageNumber = totalPages;
      offset = (pageNumber - 1) * COMMENTS_PER_PAGE;
    }

    req.db.query("SELECT id, task, completed, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS posted_at FROM todos ORDER BY id DESC LIMIT ? OFFSET ?;", [COMMENTS_PER_PAGE, offset], (err, results) => {
      if (err) {
        console.error('Error fetching todos:', err);
        return res.status(500).send('Error fetching todos');
      }

      res.render('comments', {
        title: 'Downtown Donuts',
        todos: results,
        currentPage: pageNumber,
        totalPages: totalPages,
        hasPrevPage: pageNumber > 1,
        hasNextPage: pageNumber < totalPages
      });
    });
  });
}

/* GET landing page. */
router.get('/', function(req, res, next){
  res.render('landing', {
    title: 'Downtown Donuts'
  });
});

/* GET menu page. */
router.get('/menu', function(req, res, next){
  res.render('menu', {
    title: 'Downtown Donuts Menu'
  });
});

/* GET about page. */
router.get('/about', function(req, res, next){
  res.render('about', {
    title: 'About Us'
  });
});

/* GET comments page. */
router.get('/comments', function(req, res, next){
  try {
    var parsedPage = parseInt(req.query.page, 10);
    var currentPage = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
    loadCommentsPage(req, res, next, currentPage);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
});

router.post('/create', function (req, res, next) {
    let { task } = req.body;
    
    // Trim whitespace from input
    task = task ? task.trim() : '';
    
    // Check for empty or whitespace-only input
    if (!task) {
      return res.status(400).render('comments', {
        title: 'Downtown Donuts',
        todos: [],
        currentPage: 1,
        totalPages: 1,
        hasPrevPage: false,
        hasNextPage: false,
        errorMessage: 'Please enter a comment with actual text.'
      });
    }
    
    // Check for extremely long input (limit to 1000 characters)
    if (task.length > 1000) {
      return res.status(400).render('comments', {
        title: 'Downtown Donuts',
        todos: [],
        currentPage: 1,
        totalPages: 1,
        hasPrevPage: false,
        hasNextPage: false,
        errorMessage: 'Comment is too long. Please keep it under 1000 characters.'
      });
    }
    
    try {
      req.db.query('INSERT INTO todos (task) VALUES (?);', [task], (err, results) => {
        if (err) {
          console.error('Error adding todo:', err);
          return res.status(500).render('comments', {
            title: 'Downtown Donuts',
            todos: [],
            currentPage: 1,
            totalPages: 1,
            hasPrevPage: false,
            hasNextPage: false,
            errorMessage: 'Sorry, we could not add your comment. Please try again later.'
          });
        }
        console.log('Todo added successfully:', results);
        // Redirect to the comments page after adding
        res.redirect('/comments');
      });
    } catch (error) {
      console.error('Error adding todo:', error);
      return res.status(500).render('comments', {
        title: 'Downtown Donuts',
        todos: [],
        currentPage: 1,
        totalPages: 1,
        hasPrevPage: false,
        hasNextPage: false,
        errorMessage: 'Sorry, we could not add your comment. Please try again later.'
      });
    }
});

router.post('/delete', function (req, res, next) {
    const { id } = req.body;
    try {
      req.db.query('DELETE FROM todos WHERE id = ?;', [id], (err, results) => {
        if (err) {
          console.error('Error deleting todo:', err);
          return res.status(500).render('comments', {
            title: 'Downtown Donuts',
            todos: [],
            currentPage: 1,
            totalPages: 1,
            hasPrevPage: false,
            hasNextPage: false,
            errorMessage: 'Sorry, we could not delete that comment. Please try again.'
          });
        }
        console.log('Todo deleted successfully:', results);
        // Redirect to the comments page after deletion
        res.redirect('/comments');
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
      return res.status(500).render('comments', {
        title: 'Downtown Donuts',
        todos: [],
        currentPage: 1,
        totalPages: 1,
        hasPrevPage: false,
        hasNextPage: false,
        errorMessage: 'Sorry, we could not delete that comment. Please try again.'
      });
    }
});

module.exports = router;