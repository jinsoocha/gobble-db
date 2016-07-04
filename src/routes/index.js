const UserController = require('./../controllers/UserController');
const PostController = require('./../controllers/PostController');
const ProductController = require('./../controllers/ProductController');

const routes = (app) => {
  app.get('/db/user', UserController.getUser);
  app.post('/db/user', UserController.postUser);
  app.post('/db/review', PostController.postReview);
  app.post('/db/product', ProductController.postProduct);
  app.get('/db/product', ProductController.getProduct);
  app.post('/db/like', PostController.likePost);
};

module.exports = routes;
