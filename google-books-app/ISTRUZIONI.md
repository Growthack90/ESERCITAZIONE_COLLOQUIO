# Web Application test

### Purpose of the exercise

To evaluate code organization and style and network management.

### Request

Create a responsive single-page application in React or Angular.

Use this endpoint `[https://www.googleapis.com/books/v1/volumes?q=](https://www.googleapis.com/books/v1/volumes?q=){search_terms}` and show the results of the GET call.

Implement the page with a search bar and pagination of results using API parameters.

The number of pages is dynamic and depends on the total number of elements.

The maximum limit of shown elements can be changed, accepted values are `[5, 10, 15, 20]`.

Implement a paginator to change pages.

When you click on a book you have to show the detail page containing the book's information and its link (infoLink).

If the image of the book is not defined, use placehold.co with measure of 400x600 background FF5039 color text=FFF image text=Book+Cover

### Supplied material

* API documentation: [https://developers.google.com/books/docs/v1/reference/volumes/list](https://developers.google.com/books/docs/v1/reference/volumes/list)

### Required

* In the list view, every row should truncate the description to 2 lines with "..."

* The search is live, so you have to update the results for every new character inserted.

* Use the latest version of Bootstrap and do a fully responsive layout.

* Share your finished app with us via GitHub URL and host it on CodeSandbox. You can easily import a GitHub project into CodeSandbox.

### Nice to have

* Customize the theme colors using Sass

* Use Redux, better if React Toolkit

* Use Typescript as language

* Use TailwindCSS/DaisyUI instead of Bootstrap

---