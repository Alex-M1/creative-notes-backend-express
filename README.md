# Get starting
Запуск проекта локально командой **yarn dev | npm run dev** проект запуситься на 3000 порту <br>
Так же проект залит на сервер по адресу [http://3.133.100.46/](http://3.133.100.46/) <br>
Для WebSocket используется библиотека [socket.io](https://socket.io/) <br>

В реквесте HTTP нужно отправлять в хедере Authorization токен (кроме регистрации и авторизации) <br>
По веб сокету необходимо токен отправлять в socket.handshake.headers.authorization <br>

# Requests 

## Http
### [Registration](https://github.com/Alex-M1/creative-notes-backend-express/blob/posts/docs/Http.md#registration)
### [Authorization](https://github.com/Alex-M1/creative-notes-backend-express/blob/posts/docs/Http.md#authorization)
## WebSocket 
### [Get user data](https://github.com/Alex-M1/creative-notes-backend-express/blob/posts/docs/WebSocket.md#get-user-data)
### [Create post](https://github.com/Alex-M1/creative-notes-backend-express/blob/posts/docs/WebSocket.md#create-post)
### [Get public posts](https://github.com/Alex-M1/creative-notes-backend-express/blob/posts/docs/WebSocket.md#get-public-posts)
### [Get private post](https://github.com/Alex-M1/creative-notes-backend-express/blob/posts/docs/WebSocket.md#get-private-post)
### [Get pending posts](https://github.com/Alex-M1/creative-notes-backend-express/blob/posts/docs/WebSocket.md#get-pending-posts)
### [Update public posts](https://github.com/Alex-M1/creative-notes-backend-express/blob/posts/docs/WebSocket.md#update-public-posts)
### [Update private post](https://github.com/Alex-M1/creative-notes-backend-express/blob/posts/docs/WebSocket.md#update-private-post)
### [Update pending post](https://github.com/Alex-M1/creative-notes-backend-express/blob/posts/docs/WebSocket.md#request-6)
