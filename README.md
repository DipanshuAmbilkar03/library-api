# Library Book Management API

## Setup

```
npm install
cp .env.example .env
npm start
```

## Env Variables

```
MONGODB_URI=mongodb://127.0.0.1:27017/library
PORT=5000
```

## Endpoints

### Authors

| Method | Endpoint | Purpose |
| ------ | -------- | ------- |
| POST | /api/authors | Create an author |
| GET | /api/authors | Get all authors |
| GET | /api/authors/:id | Get one author |
| GET | /api/authors/:id/books | Get all books of one author |
| PUT | /api/authors/:id | Update an author |
| DELETE | /api/authors/:id | Delete an author (only if they have no books) |

### Books

| Method | Endpoint | Purpose |
| ------ | -------- | ------- |
| POST | /api/books | Create a book |
| GET | /api/books | Get all books, with filters |
| GET | /api/books/:id | Get one book |
| PUT | /api/books/:id | Update a book |
| DELETE | /api/books/:id | Delete a book |

Filters: `?genre=` `?author=<authorId>` `?available=` `?search=`

## Author to Book Relationship

One author has many books. A book stores the author's ID in its author field and `populate('author')` returns the author details inside a book response.
