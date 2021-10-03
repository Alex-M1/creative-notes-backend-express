# User

## Registration
Чтобы произвести регистрацию в приложении необходимо отправить **POST** запрос по роуту ***/api/registration*** <br>
Тело запроса должно выглядеть следующим образом:
```
{
  "login":"admin",
  "password": "Admin123"
}
```
Все поля обязательны. Поле логин можно вводить только латинские символы и цифры <br>
Пароль должен состоять минимум из 6 символов, максимум 12 , как минимум 1 буква большого регистра и как минимум 1 цифра<br>
Если регистрация успешна вернется ответ со статусом ***201*** 
```
{
  "message": "success"
}
```
Если пользователь уже существует, то вернется ответ со статусом ***400***
```
{
  "message": "already_reg"
}
```
Если логин или пароль введен не верно вернется ответ со статусом ***400*** и сообщениями:
```
{
 "message": "invalid_login"
}
||
{
 "message": "invalid_password"
}
```

## Authorization
Чтобы произвести авторизацию необходимо отправить **POST** запрос на урл ***/api/authorization***, тело запроса <br>должно выгляеть следующим образом
```
{
  "login":"admin",
  "password": "admin123"
}
```
Все поля обязательны. Валидация аналогична регистрации
Если логин или пароль введен не верно вернется ответ со статусом ***400*** и сообщениями:
```
{
 "message": "invalid_login"
}
||
{
 "message": "invalid_password"
}
```
Если авторизация прошла успешно, вернется ответ со статусом **201**
```
{
    "token": "строка с токеном",
    "role": User | Manager | SuperAdmin
}
```
Если логин и пароль прошли валидацию, но такого пользователя не существует, придет ответ со статусом 400 и сообщением:
```
{
    "message": "user_not_found",
}
```
Если логин и пароль прошли валидацию,пользователь с таким логинов существует, но пароли не совпадают, придет ответ со статусом 401 и сообщением:
```
{
    "message": "invalid_password"
}
```

### **Важно** !!!
**После авторизации в каждом запросе в заголовке ***Authorization*** необходимо отправить токен**<br>
При пустом заголовке, неверном токене или токене у которого вышел срок жизни прийдет следующий ответ
Статус ***404***
```
{
  "message": "un_autorized"
}
```

## Get user data 
Чтобы получить данные юзера необходимо отправить **GET** запрос на урл ***/api/user_data***
В респонсе прийдет ответ такого типа
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

# Posts
## Create post (websocket)
Event ***create_post***, тело запроса <br>
должно выгляеть следующим образом
```
{
  "content": "Your content",
  "theme": "Your theme",
  "status": 'private' | 'pending' | 'public' | 'rejected'
}
```
В зависимости от пришедшего статуса вызовется ивент get_public_posts || get_private_posts
```
{
  "message": "success"
}
```
При неудачном создании прийдет ответ со статусом ***400*** и сообщением
```
{
  "message": "something_wrong"
}
```
### Юзер может оправить статус поста только pending или private если он отправит другой статус,<br>  то сервер автоматически присвоит ему статус pending


## Get public posts
Для получения постов необходимо отправить **GET** запрос на урл ***/api/public_posts***, <br>
Запрос принимает в себя следующие **необязательные** query parameters:
- theme - вернуть определенную тему поста *по дефолту вернет все темы*,
- page - номер страницы постов *по дефолту 1*
- per_page - кол-во постов на 1 странице *по дефолту 10*

При успешном запросе вернет ответ со статусом ***200*** и сообщением
```
{
  "message": {
    "posts": [
      {
        "_id": "615223b63176f45e55841794",
        "content": "Mock content111",
        "created_at": 1632773046940,
        "likes": 0,
        "theme": "hunting",
        "author": {
          "id": 23b63176f45e55841794,
          "login": Vasian 
        }
      },
      {
        "_id": "315223b63176f45e55822794",
        "content": "Mock content111",
        "created_at": 1632773046940,
        "likes": 1,
        "theme": "your theme",
        "author": {
          "id": 23b63176f45e55841794,
          "login": Vasian 
        }
      },
    ],
    "page": 1,
    "total_page": 2
  }
}
```
При неудачном создании прийдет ответ со статусом ***400*** и сообщением
```
{
  "message": "something_wrong"
}
```
## Get private posts
Для получения постов необходимо отправить **GET** запрос на урл ***/api/private_posts***, <br>
Запрос принимает в себя следующие **необязательные** query parameters:
- theme - вернуть определенную тему поста *по дефолту вернет все темы*,
- page - номер страницы постов *по дефолту 1*
- per_page - кол-во постов на 1 странице *по дефолту 10*
Для SuperAdmin`а обязательные query parameters
- id - id пользователя посты которого нужно получить
Ответы аналогичны **Get public posts**
Если кто то пытается получить чужие посты и при этом не является SuperAdmin прийдет ответ статус ***403***
```
{
  "message": "no_rights"
}
```
## Get pending posts
Для получения постов необходимо отправить **GET** запрос на урл ***/api/pending_posts***, <br>
необязательные параметры, и ответы аналогичны предыдущим роутам. Юзер может получить только свои посты,<br>
Админ и менеджер получат все посты.

## Update public posts
method: PUT,
url: /api/public_posts
body:
```
{
  "postId": string,
  "likes": number
}
```
status 200
```
{
  "message": "success"
}
```
status 400
```
{
  "message": "something_wrong"
}
```

## Update pending posts
method: PUT,
url: /api/pending_posts
body from User:
```
{
  "postId": string,
  "theme"?: string
  "content"?: string
}
```
body from other roles 
```
{
  "postId": string,
  "status": string
}
```
status 200
```
{
  "message": "success"
}
```
status 400
```
{
  "message": "something_wrong"
}
```