# Assignment 5 — Sequelize / MySQL

## Setup
1. Start MySQL from XAMPP Control Panel.
2. Open `http://localhost/phpmyadmin` and create database `assignment5_sequelize`.
3. Copy `.env.example` to `.env` and change credentials if needed.
4. Run `npm install`, then `npm run dev`.
5. API base URL: `http://localhost:3000`.

## Routes and Postman examples

| Method | URL | Body / Query |
|---|---|---|
| POST | `/users/signup` | `{"name":"Ziad Gamal","email":"ziad@example.com","password":"secret123","role":"user"}` |
| PUT | `/users/1` | `{"name":"Updated Name"}` |
| GET | `/users/by-email?email=ziad@example.com` | Query email |
| GET | `/user/1` | Excludes role and password |
| POST | `/posts` | `{"title":"First post","content":"Hello","userId":1}` |
| DELETE | `/posts/1` | `{"userId":1}` |
| GET | `/posts/details` | No body |
| GET | `/posts/comment-count` | No body |
| POST | `/comments` | `[{"content":"Nice post","postId":1,"userId":1}]` |
| PATCH | `/comments/1` | `{"userId":1,"content":"Updated comment"}` |
| POST | `/comments/find-or-create` | `{"postId":1,"userId":1,"content":"Nice post"}` |
| GET | `/comments/search?word=post` | Query word |
| GET | `/comments/newest/1` | Post ID |
| GET | `/comments/details/1` | Comment ID |

## Suggested test order
1. Sign up users.
2. Create a post using an existing userId.
3. Bulk-create comments using valid postId and userId values.
4. Test details, comment counts, search, newest comments and comment details.
5. Try updating/deleting using a different user's ID and verify the request is rejected.
6. Export the Postman collection and submit its link with the assignment.

User uses `sequelize.define`; Post and Comment use `Model.init`; relationships are defined in `models/index.js`. Posts use `paranoid: true` for soft delete.
`PUT /users/:id` intentionally skips Sequelize validation to demonstrate the assignment requirement. In production, use authentication/authorization and do not trust a client-supplied userId for ownership.
