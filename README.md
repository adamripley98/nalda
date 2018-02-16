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
# Feature tracking

## By 2/17
- [ ] Image upload
  - [X] Profile picture
  - [ ] Listing multiple pictures
  - [X] Articles multiple pictures
  - [ ] Styling for all these
  - [X] Error handling
- [ ] Ensure everything works on live site
  - [ ] Google oAuth
  - [ ] Facebook oAuth
  - [ ] Sendgrid
  - [ ] Image upload
    - [ ] Especially on mobile
- [X] SSL fix
- [ ] Gallery on listing
  - [ ] Backend
  - [ ] Frontend
- [ ] Nalda's favorite section on listing (similar to description except opinion)
- [ ] Flash notifications upon register, signup, submissions, etc.
- [ ] Securing auth routes better
- [ ] Admin panel
  - [X] Fix display bug
  - [X] Curator/Admin list
  - [X] See users (scroll menu)
  - [ ] See all content
- [ ] Rough beginning to homepage
- [ ] Random bug fixes
  - [ ] Login/register color display on safari
  - [ ] Link 'forgot your password' to edit password form
  - [ ] Ensure all locations entered are valid addresses/cities
  - [ ] Error check for empty inputs
- [ ] Weird bug where account page now logs you out if you try refreshing
- [X] Bug where profile picture doesn't show up sometimes (storing in AWS as a single pixel?)
- [ ] Edit content bug?
# Cam
- [ ] Style Reset password better on `LoginModal` and `Login`
- [ ] Display a banner on Account page asking people to verify their email (instead of text)
- [ ] Make trash can to delete reviews bigger
- [ ] Style file upload in `Account.js`,
- [ ] Style frontend for homepage
- [ ] hamburger turns to X animation
- [ ] Stop using production mlab for testing
- [ ] Push changes live

## Admins

- [X] Admin add page (similar look to contact page) where admins can enter email addresses and add both other admins and other content creators. Only admins can add people as content creators and only content creators can create posts.
- [X] Allow admins to update a user's privileges (ex. from user to curator)
- [X] Protect `admin`, `curator`, and `user` routes.
- [X] Allow `users` to leave reviews: comments and ratings.

## Users

- [X] SendGrid configuration
  - [X] Contact page
  - [X] Password reset
  - [X] Device authorization (confirm your email)
- [X] Add author field to every form of content
  - [X] Videos
  - [X] Listings
  - [X] Articles
- [X] Curator show pages
  * This should display all of the content a curator has written
- [X] Default create users with type `user`. Admin can switch them to `admin` or `curator`
- [X] Give users ability to set and change profile pictures, update this in new article/listing/video backend
- [X] Make it so you can click and view author pages, author page should also list all their
- [ ] Reviews should be stored in user model too.

## Listings

- [X] Store an array of times or two fields for each day
- [X] Store reviews on listings
- [X] Form for adding reviews
- [X] Complete listing view
- [X] Complete listing backend (already stores listing in Mongo, just need to populate to home screen.
- [X] Figure out why listings page is not displaying
- [X] `Listing` back to all listings button
- [X] Edit Listings view
- [X] Delete Listings view
- [x] Listings location should also show as an address
- [X] Store author
- [X] Add to curator's list of content
- [X] Style edit/delete buttons better
- [X] Default sort in `Listings` needs to be reversed
- [ ] Free / other price option
- [ ] Sort by date

## Videos

- [X] Improve styling
- [X] Video backend
- [X] Edit Videos view
- [X] Delete Videos view
- [X] Store author
- [X] Add to curator's list of content
- [X] Default sort in `Videos` needs to be reversed
- [ ] Preview needs time stamp
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
- [X] Setting up SCSS
- [X] Video styling
- [X] Individual listing view
- [X] Routing 	
- [X] User show pages (backend is working, needs to be styled though)
- [X] Footer
- [X] Article form display
- [X] Video form display
- [X] Listing form display
- [X] Login/Register/Reset/Edit Account Form styling
- [X] Ajax search suggestions
- [X] Incorporate Nalda logo and other advice from Edward
- [X] Home page needs to have other ways of sorting: most popular, by category, by author?, etc
- [X] Side Nav Bar should close once an option is clicked
- [X] Nav bar should only show name and location when a user is logged in
- [X] Update preview styling
- [X] Get rid of article reducer
- [X] Style nav bar so it looks okay when no user is logged in (no user or location)
- [X] Create a curator profile view (Should show name, location, bio, contact info, and all content created)
- [X] Update meta tags for all forms of content
- [X] Arrows on sort buttons
- [X] Nav bar style when no one is logged in
- [X] Style curator profile view (`Profile.js`). Add profile picture spot! (also add profile pic spot to `Account.js`)
- [x] Back to home button on individual listing page
- [X] Style search button in Nav bar (make it only visible when someone has typed something)
- [X] Display search results on the frontend (backend is done)
- [x] Load component on `Account.js` and `Profile.js` and others.
- [X] Sorting buttons at top of `Listings.js`, `Videos.js`, and `Articles.js`
- [X] `Admin.js` restyle 3 buttons & display successful admin change on frontend
- [X] Standardize size of all pictures on home page
- [X] Have listing location be a map picture
- [ ] Only display first name in nav bar
- [ ] Icons for all amenities
- [ ] Make it easier for an admin to enter hours (some sort of autofill)
- [ ] Get rid of any userId passing from frontend unless it is for comparing to backend userId
- [ ] Clear hashtag from url after google login
- [ ] Email verify on account page should be below loading
- [ ] Styling on the emails sent by Nalda: Welcome, reset, and verify.


## Backend

- [X] Boilerplate setup
- [X] MongoDB setup
- [X] React/Redux setup
- [X] Setting up component structures
- [X] Password security
- [X] HTTPS
- [X] Domain registration/setup
- [X] Better user auth checks on the backend
- [X] Better parameter error checking on the backend
- [X] Link user data to posted article
- [X] Give content a timestamp
  - [X] Videos
  - [X] Listings
  - [X] Articles
- [X] Curator profile view
- [X] Change/forgot password backend
- [X] Replace dummy data
  - [X] Location
  - [X] Profile picture
  - [X] Bio
- [X] Replace dummy data in `Account.js`
- [X] Add bio and content to `user` schema
- [X] Update listing review schema to have author's id
- [X] Admin remove curators functionality
- [X] Security on backend
  - [X] Require admin to make changes (`curator/new`, `admin/new`, `curator/remove`)
  - [X] Require curator or admin to post content (all post routes)
  - [X] Don't return sensitive user data (password)
- [X] Change location functionality
- [X] Reviews by id instead of name
- [X] Most recent in reverse order
- [X] UpdateReviews method is unnecessary - just use setState
- [X] Delete review authentication check
- [X] New password must meet validity conditions
- [X] Ensure duplicate emails cannot be registered (through facebook and google oauth)
  - [X] If account already exists, should simply add googleId or facebookId to that user, not create a new account
- [X] Verify account via email
  - [X] Send email welcoming user to nalda
  - [X] Display banner on account page
    - [X] Banner click should send another verify email
  - [X] Local Login
  - [X] FACEBOOK
  - [X] Google
- [X] Sendgrid configuration for sending emails
  - [X] Contact us page
  - [X] Confirm email page
  - [X] Forgot password reset
- [X] Split up `routes.js` into many smaller files
- [ ] Sort reviews functionality (time, rating)
- [X] Add author to listings and videos? At least on backend
- [X] Delete reviews functionality
- [X] Login/Register OAuth with google and facebook
- [ ] Technical errors should not be displayed to frontend, should be vague.
- [ ] Searching functionality
  - [X] Articles
  - [X] Videos
  - [X] Listings
  - [X] Curators
  - [ ] Location
- [ ] Filter listings by amenities
- [ ] Give user model a "private" field (object containing info like password, email, etc) & have API not return it.
- [ ] Extra security for auth routes: userId pulled from backend
- [ ] Fix issues with reviews and content displaying not chronologically
- [ ] Location for google and facebook oAuth, get rid of dummy location data
- [ ] Failure redirects for resetting password
- [ ] Have listing tag clicks lead to a page that displays all listings of that tag
- [ ] Make sure file uploads are pictures and are appropriate sizes

# TODO from Feb 11 meeting
- [ ] Weird bug with review delete
- [ ] Weird bug where admin panel doesn't show up
- [ ] Listing changes
  - [ ] Description text area
  - [ ] Editor's review section (listings)
  - [ ] Mobile At a glance
  - [ ] Also make it default close
  - [ ] Change icons for that
  - [ ] Hero image
  - [ ] Add more images
  - [ ] Max images (6)
  - [ ] Two column listings
- [ ] Article changes
  - [ ] Links to other things
  - [ ] Link to listings that are relevant
- [ ] Video changes
  - [ ] Component for product thumbnails "featured in this video" (links to other things)
  - [ ] Play button on top of video
- [ ] Home page
  - [ ] Banner on top, primarily articles and videos.
    - [ ] Upload specific hero images for home page banner
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
- [ ] Make it scroll to the top when you load a new page
- [ ] Media library of images from AWS already uploaded to make curators life easier

## General cleanup

- [X] Make a check in the `AppContainer` component to ensure that `passport` and `redux` are in sync (`redux persist`) makes it such that this can outlast the backend session
- [X] Style about page
- [X] General clean up, get rid of console.logs and deal with errors better
- [X] Get rid of redux capabilities of all components that don't use redux
- [ ] Change title tag, description, other meta tags depending on the page
- [ ] Go back and take care of all TODO's
- [ ] Stop unnecessarily passing userId to backend
- [ ] Make sure all form submissions check for empty fields on frontend and/or backend
- [ ] Backend error checking should be in separate file
- [ ] Get rid of unnecessary packages in `package.json`
- [ ] All emails sent should be placed into `sendEmail.js`
- [ ] Create a helper method file for image upload
- [ ] Clear errors if resp.data.success
- [ ] Change edit routes from post to put

## Other
- [ ] Google Analytics

## Search
- [X] Frontend issue where it displays two articles on one line
- [X] Clicking a link closes suggestion and clears search bar
- [ ] Search by Location
- [ ] Issue where "ada" doesn't populate "adam ripley" but "adam" does (I think best way to deal with this is search button)
- [ ] Don't let it search through reviews
- [ ] Fix refresh hack

## Bugs
- [X] Fix authentication route bug
  * When you refresh on a page that requires authentication it redirects to the home page (this should not be the case if the session persists)
- [X] Bug where login error crashes app instead of displaying error
  - [X] 'Cannot set headers after they are sent' error crashes app
- [X] Persist issue, now it makes you log back in all the time. Perhaps passport session is very short?
- [X] Search doesn't redirect to page
- [X] Article preview click doesn't render article
- [X] Reviews can leave more than one.
- [X] Register doesn't log user in?
- [X] Admin route goes to /articles/admin
- [X] User page not always found
- [X] Users profiles shouldn't be displayed, only admin/curators
- [X] Video image not showing up on thumbnail
- [X] Video edit location clearing bug
- [ ] SSL is not fully secure?
- [ ] Admin panel not displaying?

## Adam

## Potential features for future
- [ ] Users can leave comments on videos and articles
- [ ] Multiple curators on the same content
- [ ] Recommending content for users to look at
  * To begin they can be location based and random, eventually custom based on user


## Questions
