# Get user data
  ## Request
  #### Event
  **user_info**
  #### Body
  ```
  {}
  ```
  ## Response
   #### EVENT:
   **user_info**
   #### BODY:
   ```
    {
      "message":{
        "login": "qwerty1",
        "online": false,
        "name": "Name",
        "lastName": "",
        "img": "",
        "city": "Kharkiv",
        "age": "",
        "role": User | Manager | SuperAdmin
      }
    }
   ```
# Create post 
  ## Request
  #### EVENT:
  **create_post**
  #### BODY:
  ```
  {
    theme: string,
    status: pending | private,
    content: string,
    page: number
    per_page: number 
  }
  ```
  ## Response
  ### Message status === private
  #### EVENT 
  **get_private_posts**
  #### BODY
  Юзер который отправил запрос получит:
  ```
  {
    message:{
      page : number
      per_page: number,
      totalPage: number
      posts: [
        {
          "_id": "615223b63176f45e55841794",
          "content": "Mock content111",
          "created_at": 1632773046940,
          "likes": [string(userId)],
          "theme": "hunting",
          "author": {
            "id": 23b63176f45e55841794,
            "login": Vasian 
          }
        },
      ]
    }
  }
  ```
  ### Message status === pending
  #### EVENT 
  **get_pending_posts**
  Получит пост как в предыдущем примере юзер, а так же Админ и Менеджеры

# Get public posts
 ## Request
 #### Event:
  **get_public_posts**
  #### BODY: 
  {
    page?: number,
    per_page?: number,
    theme?: sting,
  }
  ## Response 
  #### EVENT 
  **get_public_posts**
  #### BODY: 
  Аналогично респонсу  ***Create post*** 

# Get private post
  ## Request 
  #### EVENT:
  **get_private_posts**
  #### BODY:
  ```
    page?: number,
    per_page?: number,
    theme?: string,
    author?: string - from SuperAdmin
  ```

  ### Respose
   #### EVENT
  **get_private_posts**

  ### role === SuperAdmin && author
  Получит приватные посты заданного пользователе
  ### else case
    Получат свои приватные посты
  
# Get pending posts
## Request
  #### EVENT:
   **get_pending_posts**
  #### BODY:
  ```
  {
    theme?: string,
    page?: number,
    per_page?: number
  }
  ```
  ## Response
  #### EVENT:
  **get_pending_posts**
  ### role === User:
  Получит свои посты со статусом **pending**
  ### role === Manager:
  Получит все посты со статусом **pending** кроме своих
  ### role === SuperAdmin
  Получит  все посты со статусом **pending**

# Update public posts
  ## Request
  #### EVENT:
  **upd_public_post**
  #### BODY:
  ```
    {
      postId: string,
      page?: number,
      per_page?: number,
      theme?: string,
      login: string,
    }
  ```
  ## Response
  #### EVENT
  **get_public_posts**
  Все пользователи получат обновленные посты

# Update private post
  ## Request
  #### EVENT:
  **upd_private_post**
  #### BODY:
  ```
  {
    postId: string,
    status: pending | public(only SuperAdmin),
    page: number,
    per_page: number,
  }
  ```
  ## Response
   #### EVENT:
   **get_private_posts**
  Пользователь получит свои приватные посты

# Update pending post
 ## Request:
 #### EVENT:
**upd_pending_post**
  #### BODY:
  ```
  {
    theme: string,
    content: string,
    status: rejected | public | pending(если не надо менять статус)
    postId: string,
    page: number,
    per_page: number
  }
  ```
  