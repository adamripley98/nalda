# Nalda

A centralized source for information, food, activities, and fun on your campus. Developed by @adamripley98 and @ccabo1. View the timesheet [here.](https://docs.google.com/spreadsheets/d/1FaistICZ-BuORu7YYm5fFpgii2cvxZKgEpxApWQ_3pY/edit?usp=sharing)

![Nalda](https://s3.amazonaws.com/nalda/nalda-overview.png)

-------------------

### Stack
* `React` JavaScript framework for all views
* `Redux` overarching application state
* `Passport` user authentication
* `Node` JavaScript on the backend
* `Express` backend API library
* `MongoDB` database

To run the application, run `npm start`. For more responsive hot-reloading on the backend and frontend, run `npm run frontend` and `npm run backend` concurrently.

-------------------

### API
```javascript
/* General */
GET '/api/'                    // Route to confirm the API is working
GET '/api/home'                // Get homepage content

/* Articles */
GET '/api/articles'            // Get all articles
GET '/api/articles/:id'        // Get a specific article
POST '/api/articles/new'       // Create a new article
POST '/api/articles/:id/edit'  // Edit a specific article
DELETE '/api/articles/:id'     // Delete a specific article

/* Listings */
GET '/api/listings'            // Get all listings
GET '/api/listings/:id'        // Get a specific listing
POST '/api/listings/new'       // Create a new listing
POST '/api/listings/:id/edit'  // Edit a specific listing
DELETE '/api/listings/:id'     // Delete a specific listing

/* Videos */
GET '/api/videos'              // Get all videos
GET '/api/videos/:id'          // Get a specific video
POST '/api/videos/new'         // Create a new video
POST '/api/videos/:id/edit'    // Edit a specific video
DELETE '/api/videos/:id'       // Delete a specific article
```
API documentation can be found [here.](https://nalda-api.herokuapp.com/)

-------------------

### Feature tracking

Features are now tracked exclusively through Trello. All features previously listed below were simply for reference and should not be treated as a source of truth.

-------------------

### Contributing

Pre-commit hooks are in place to lint `.js` and `.scss` files. Code should be well-formatted and should resolve all errors and warnings prior to being committed.
