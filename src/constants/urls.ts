export const URLS = {
  api: '/api',
  user: {
    auth: '/authorization',
    reg: '/registration',
    userData: '/user_data',
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
  user_info: 'user_info',
};
