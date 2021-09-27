import { Router } from 'express';
import { Posts } from '@controllers/Posts/Posts.controller';
import { URLS } from '@constants/urls';
import { tokenValidation } from '@helpers/validations';

const route = Router();
const { createPost, getPublicPosts } = new Posts();

route.get(URLS.posts.public_posts, tokenValidation, getPublicPosts);
route.post(URLS.posts.create_post, tokenValidation, createPost);

export default route;
