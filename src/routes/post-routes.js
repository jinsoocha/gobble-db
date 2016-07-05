const PostController = require('../controllers/PostController');

const routes = app => {
  app.get('/db/post/date', PostController.sendPostsByDate);
  app.get('/db/post/friends', PostController.sendPostsByFriends);
  app.get('/db/post/parent', PostController.sendCommentsByParentId);
  app.get('/db/post/reviews', PostController.sendAllReviews);
};

module.exports = routes;
