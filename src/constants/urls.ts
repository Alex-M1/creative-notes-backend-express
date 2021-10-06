export const URLS = {
  api: '/api',
  user: {
    auth: '/authorization',
    reg: '/registration',
    userData: '/user_data',
    change_pass: '/change_password',
    change_user_data: 'change_user_data',
    change_user_role: 'change_user_role',
  },
  posts: {
    create_post: '/create_post',
    public_posts: '/public_posts',
    private_posts: '/private_posts',
    pending_posts: '/pending_posts',
  },
};

export const SOCKET_EVT = {
  check_auth: 'check_auth',
  error: 'error',
  user_info: 'user_info',
  create_post: 'create_post',
  get_public_posts: 'get_public_posts',
  get_private_posts: 'get_private_posts',
  get_pending_posts: 'get_pending_posts',
  upd_public_post: 'upd_public_post',
  upd_pending_post: 'upd_pending_post',
  upd_private_post: 'upd_private_post',
  create_comment: 'create_comment',
};
