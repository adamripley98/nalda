# Nalda

A centralized source for information, food, activities, and fun on your campus. Developed by @adamripley98 and @ccabo1. View the timesheet [here.](https://docs.google.com/spreadsheets/d/1FaistICZ-BuORu7YYm5fFpgii2cvxZKgEpxApWQ_3pY/edit?usp=sharing)

![Nalda](https://s3.amazonaws.com/nalda/nalda-overview.png)

__Stack used:__
* `React` JavaScript framework for all views
* `Redux` overarching application state
* `Passport` user authentication
* `Node` JavaScript on the backend
* `Express` backend API library
* `MongoDB` database

To run the application, run `npm start`. For more responsive hot-reloading on the backend and frontend, run `npm run frontend` and `npm run backend` concurrently.

# API
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

# Feature tracking

## By 2/17
- [X] Image upload
  - [X] Profile picture
  - [X] Listing multiple pictures
  - [X] Articles multiple pictures
  - [X] Edit articles
  - [X] Edit listings
  - [X] Styling for all these
  - [X] Error handling
- [X] Ensure everything works on live site
  - [X] Google oAuth
  - [X] Facebook oAuth
  - [X] Sendgrid
  - [X] Image upload
    - [X] Especially on mobile
- [X] SSL fix
- [X] Gallery on listing
  - [X] Backend
  - [X] Frontend
- [X] Nalda's favorite section on listing (similar to description except opinion)
- [X] Flash notifications upon register, signup, submissions, etc.
- [X] Securing auth routes better
- [X] Admin panel
  - [X] Fix display bug
  - [X] Curator/Admin list
  - [X] See users (scroll menu)
  - [X] See all content
- [X] Rough beginning to homepage
- [X] Random bug fixes
  - [X] Ensure all locations entered are valid addresses/cities
  - [X] Error check for empty inputs
- [X] Store images in subfolders for each listing or article
- [X] Only first name in nav bar
- [X] Location with facebook/google
- [X] Edit articles/listings with file uploads
- [X] Test
  - [X] editing article main,
  - [X] listing main,
  - [X] article other,
  - [X] listing carousel
- [X] Edit profile more intuitive with save button
- [ ] Admin panel work
  - [X] No link to user pages
  - [ ] Ability to delete users from admin panel
  - [X] Categories should be scroll (or only show 10 of each) or search
  - [X] Email should link to a sendto=email
  - [ ] Add as admin/curator should be next to users name (along with delete)
  - [x] Add area to pick homepage featured images
  - [X] After upgrading from curator to admin, should refresh and show state instantaneously
- [ ] Delete account functionality

## Listings
- [ ] Free / other price option
- [ ] Sort by date

## Videos
- [ ] Individual video frontend updates
  - [ ] Show Location
  - [x] Show date created
  - [x] Show author data
- [ ] Sort by date

## Articles
- [X] Edit Articles view
- [X] Delete Articles view
- [X] Default sort in `Articles` needs to be reversed
- [X] Preview needs time stamp
- [ ] Individual article frontend updates
  - [ ] Show Location
  - [x] Show date created
  - [x] Show author data

## Frontend
- [x] Icons for all amenities
- [ ] Make it easier for an admin to enter hours (some sort of autofill)
- [ ] Get rid of any userId passing from frontend unless it is for comparing to backend userId
- [ ] Clear hashtag from url after google login
- [X] Styling on the emails sent by Nalda: Welcome, reset, and verify.

## Backend
- [ ] Sort reviews functionality (time, rating)
- [X] Technical errors should not be displayed to frontend, should be vague.
- [ ] Searching functionality
  - [X] Articles
  - [X] Videos
  - [X] Listings
  - [X] Curators
  - [ ] Location
- [X] Filter listings by amenities
- [X] Extra security for auth routes: userId pulled from backend
- [ ] Fix issues with reviews and content displaying not chronologically
- [X] Location for google and facebook oAuth, get rid of dummy location data
- [ ] Failure redirects for resetting password
- [X] Have listing tag clicks lead to a page that displays all listings of that tag
- [ ] Make sure file uploads are pictures and are appropriate sizes

# TODO from Feb 11 meeting
- [ ] Listing changes
  - [X] Description text area
  - [X] Editor's review section (listings)
  - [X] Mobile At a glance
  - [X] Also make it default close
  - [X] Change icons for that
  - [X] Hero image
  - [X] Add more images
  - [X] Max images (6)
  - [ ] Two column listings
- [ ] Article changes
  - [ ] Links to other things
  - [ ] Link to listings that are relevant
- [ ] Video changes
  - [ ] Component for product thumbnails "featured in this video" (links to other things)
  - [X] Play button on top of video
- [ ] Home page
  - [X] Banner on top, primarily articles and videos.
    - [X] Upload specific hero images for home page banner
  - [ ] Underneath banner, different listing options
  - [ ] Featured, Recommended for you, etc.
  - [ ] Browse by category
  - [ ] Make articles, listings, videos more cohesive, not separate section
  - [ ] Infinite scroll
  - [ ] Video play options
- [ ] Featured checkbox on content creation forms
- [ ] Default to University of Pennsylvania, eventually will have other campuses
- [ ] Searching content by location
- [ ] Ask users for current location
- [ ] Google maps pulling hours for companies and such
- [X] Make it scroll to the top when you load a new page
- [ ] Media library of images from AWS already uploaded to make curators life easier

## Code refactoring

- [ ] Change title tag, description, other meta tags depending on the page
- [ ] Go back and take care of all TODO's
- [ ] Stop unnecessarily passing userId to backend
- [ ] Make sure all form submissions check for empty fields on frontend and/or backend
- [ ] Backend error checking should be in separate file
- [X] Get rid of unnecessary packages in `package.json`
- [ ] All emails sent should be placed into `sendEmail.js`
- [ ] Create a helper method file for image upload
- [ ] Clear errors if resp.data.success
- [ ] Change edit routes from post to put
- [ ] Make edit routes far more efficient
- [X] Change delete reviews from post to delete
- [ ] Delete a user, delete all content of that user
- [X] When article or listing is deleted, content is deleted from AWS
- [ ] When content is edited, old images are deleted from AWS
- [ ] Pass all errors back as `res.status(404).send`

## Other
- [ ] Google Analytics

## Search
- [ ] Search by Location
- [X] Issue where "ada" doesn't populate "adam ripley" but "adam" does (I think best way to deal with this is search button)
- [X] Don't let it search through reviews
- [ ] Fix refresh hack

## Potential features for future
- [ ] Multiple curators on the same content
- [ ] Recommending content for users to look at
  * To begin they can be location based and random, eventually custom based on user
