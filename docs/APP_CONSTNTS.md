# Константы в приложении

## Ключи ошибок
- already_reg - пользователь зарегестрирован
- success - успешны запрос
- user_not_found - пользователь не найден
- invalid_password - неверный пароль
- invalid_login - неверный логин
- something_wrong - ошибка запроса
- un_autorized - неавторизирован
- no_rights - нет прав на выполнение текущего запроса
- no_content - если при создании поста не пришел контент
- already_like - данный юзер уже лайкнул пост

## Socket events
- check_auth,
- error,
- user_info,
- create_post,
- get_public_posts,
- get_private_posts,
- get_pending_posts,
- upd_public_post,
- upd_pending_post,
- upd_private_post,

## URLS
```
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
```