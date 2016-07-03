const { Product, User, Review, Post, Follow } = require('../models');
const QueryBuilder = require('../orm/querybuilder');

const getPostsByDate = function(date, limit) {
  const qb = new QueryBuilder();
  const qb2 = new QueryBuilder();
  qb2.select({ what: '*', from: 'Post', limit, where: 'parentId IS NULL', orderBy: 'Post_created_at', as: 'T1' });
  return (qb
    .select({ what: '*', from: qb2.materialize() })
    .innerJoin({ target: 'User', on: { 'User.facebook_id': 'T1.User_facebook_id' } })
    .leftJoin({ target: 'Product', on: { 'T1.Product_upc': 'Product.upc' } })
    .orderBy('T1.Post_created_at')
    .fire());
};

const getPostsByFriends = function(date, limit, user) {
  const qb = new QueryBuilder();
  const qb2 = new QueryBuilder();
  qb2.select({ what: 'followed', from: 'Follow', where: `Follow.follower = ${user}`, as: 'T1' });
  return (qb
    .select({ what: '*', from: qb2.materialize() })
    .innerJoin({ target: 'User', on: { 'User.facebook_id': 'T1.followed' } })
    .innerJoin({ target: 'Post', on: `Post.parentId IS NULL AND T1.followed = Post.User_facebook_id AND date(Post.Post_created_at) < date('${date}')` })
    .leftJoin({ target: 'Product', on: { 'Post.Product_upc': 'Product.upc' } })
    .orderBy('Post_created_at')
    .fire()
    .then(res => res.slice(0, limit + 1)));
};

const getPostsById = function(arrayOfPostIds) {
  const qb = new QueryBuilder();
  const nested = new QueryBuilder();

  nested.select({ what: '*', from: 'Post', whereIn: { 'Post.postId': arrayOfPostIds }, as: 'T1' });

  return (qb
    .select({ what: '*', from: nested })
    .innerJoin({ target: 'User', on: 'Post.User_facebook_id = User.facebook_id' })
    .innerJoin({ target: 'Product', on: 'Post.Product_upc = Product.upc' })
    .fire());
};
// getPostsByDate('2016-07-30 00:00:00', 20).then(res => console.log(res));
Post.save({ User_facebook_id: 2, Product_upc: 20394892038402936 });
// User.save({ facebook_id: 1, first_name: 'Charles', last_name: 'Zhang' });
// User.save({ facebook_id: 2, first_name: 'Will', last_name: 'Tang' });
// Follow.save({ follower: 1, followed: 2 });
// Product.save({ upc: 20394892038402936 });
// getPostsByFriends('2016-07-30 00:00:00', 20, 1).then(res => console.log('#######', res));
module.exports = { getPostsByDate, getPostsByFriends, getPostsById };
