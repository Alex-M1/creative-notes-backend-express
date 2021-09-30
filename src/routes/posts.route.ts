import { Router } from 'express';
import { Posts } from '@controllers/Posts/Posts.controller';
import { URLS } from '@constants/urls';
import { tokenValidation } from '@helpers/validations';

const route = Router();
const posts = new Posts();

route.get(URLS.posts.public_posts, tokenValidation, posts.getPublicPosts);
route.put(URLS.posts.public_posts, tokenValidation, posts.updatePublicPosts);

route.get(URLS.posts.private_posts, tokenValidation, posts.getPrivatePosts);
route.put(URLS.posts.private_posts, tokenValidation, posts.updatePrivatePosts);

route.get(URLS.posts.pending_posts, tokenValidation, posts.getPendingPosts);
route.put(URLS.posts.pending_posts, tokenValidation, posts.updatePendingPosts);

route.post(URLS.posts.create_post, tokenValidation, posts.createPost);

export default route;
