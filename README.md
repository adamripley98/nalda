# Nalda

A centralized source for information, food, activities, and fun on your campus.

__Stack used:__
* `React` JavaScript framework for all views
* `Redux` overarching application state
* `Passport` user authentication
* `Node` JavaScript on the backend
* `Express` backend API library
* `MongoDB` database

View the timesheet [here.](https://docs.google.com/spreadsheets/d/1FaistICZ-BuORu7YYm5fFpgii2cvxZKgEpxApWQ_3pY/edit?usp=sharing)

To run the application, run `npm start`. For more responsive hot-reloading on the backend and frontend, run `npm run frontend` and `npm run backend` concurrently.

## Currently Working on:
Backend for articles and listings

## Admins

- [X] Admin add page (similar look to contact page) where admins can enter email addresses and add both other admins and other content creators. Only admins can add people as content creators and only content creators can create posts.
- [X] Allow admins to update a user's privileges (ex. from user to curator)
- [X] Protect `admin`, `curator`, and `user` routes.
- [ ] Allow `users` to leave reviews: comments and ratings.

## Users

- [ ] SendGrid configuration
  - [ ] Contact page
  - [ ] Password reset
  - [ ] Device authorization (confirm your email)?
- [ ] Add author field to every form of content
  - [ ] Videos
  - [ ] Listings
  - [X] Articles
- [X] Curator show pages
  * This should display all of the content a curator has written
- [X] Default create users with type `user`. Admin can switch them to `admin` or `curator`
- [ ] Give users ability to set and change profile pictures, update this in new article/listing/video backend
- [X] Make it so you can click and view author pages, author page should also list all their articles

## Listings

- [X] Store an array of times or two fields for each day
- [X] Store reviews on listings
- [ ] Store comments on articles
- [X] Form for adding reviews
- [X] Complete listing view
- [X] Complete listing backend (already stores listing in Mongo, just need to populate to home screen.
- [X] Figure out why listings page is not displaying
- [ ] `Listing` back to all listings button

## Videos

- [X] Improve styling
- [X] Video backend
- [ ] Allow comments?

## Frontend

- [X] Setting up SCSS
- [X] Video styling
- [X] Individual listing view
- [X] Routing 	
- [ ] User show pages (backend is working, needs to be styled though)
- [X] Footer
- [X] Article form display
- [X] Video form display
- [X] Listing form display
- [ ] Login/Register/Reset/Edit Account Form styling
- [X] Ajax search suggestions
- [X] Incorporate Nalda logo and other advice from Edward
- [X] Home page needs to have other ways of sorting: most popular, by category, by author?, etc
- [X] Side Nav Bar should close once an option is clicked
- [X] Nav bar should only show name and location when a user is logged in
- [ ] Icons for all amenities
- [X] Get rid of article reducer
- [X] Style nav bar so it looks okay when no user is logged in (no user or location)
- [X] Create a curator profile view (Should show name, location, bio, contact info, and all content created)
- [ ] Update meta tags for all forms of content

## Backend

- [X] Boilerplate setup
- [X] MongoDB setup
- [X] React/Redux setup
- [X] Setting up component structures
- [X] Password security
- [ ] HTTPS
- [ ] Searching functionality
  - [X] Articles
  - [X] Videos
  - [X] Listings
  - [X] Curators
  - [ ] Location
- [ ] Domain registration/setup
- [ ] Better user auth checks on the backend
- [ ] Better parameter error checking on the backend
- [X] Link user data to posted article
- [ ] Give content a timestamp
  - [ ] Videos
  - [ ] Listings
  - [X] Articles
- [X] Curator profile view
- [X] Change/forgot password backend
- [ ] Replace dummy data
  - [ ] Location
  - [ ] Profile picture
  - [X] Bio
- [ ] Replace dummy data in `Account.js`
- [X] Add bio and content to `user` schema
- [ ] Update listing review schema to have author's id
- [ ] Sort listings by amenities
- [X] Admin remove curators functionality
- [ ] Security on backend
  - [ ] Require admin to make changes (`curator/new`, `admin/new`, `curator/remove`)
  - [ ] Require curator or admin to post content (all post routes)
  - [X] Don't return sensitive user data (password)
- [ ] Change location functionality

## Cam
- [X] Nav bar style when no one is logged in
- [ ] Style curator profile view (`Profile.js`). Add profile picture spot! (also add profile pic spot to `Account.js`)
- [ ] Back to home button on individual listing page
- [X] Style search button in Nav bar (make it only visible when someone has typed something)
- [X] Display search results on the frontend (backend is done)
- [ ] Load component on `Account.js` and `Profile.js` and others.
- [ ] Sorting buttons at top of `Listings.js`, `Videos.js`, and `Articles.js` (actual sorting done)
- [ ] `Admin.js` restyle 3 buttons & display successful admin change on frontend
- [ ] Standardize size of all pictures on home page

## General cleanup

- [X] Make a check in the `AppContainer` component to ensure that `passport` and `redux` are in sync (`redux persist`) makes it such that this can outlast the backend session
- [X] Style about page
- [ ] General clean up, get rid of console.logs and deal with errors better
- [ ] Change title tag, description, other meta tags depending on the page
- [X] Get rid of redux capabilities of all components that don't use redux
- [ ] Go back and take care of all TODO's
- [ ] Make sure all form submissions check for empty fields on frontend and/or backend

## Search
- [ ] Search by Location
- [ ] Issue where "ada" doesn't populate "adam ripley" but "adam" does (I think best way to deal with this is search button)
- [ ] Don't let it search through reviews
- [X] Frontend issue where it displays two articles on one line
- [ ] Clicking a link closes suggestion and clears search bar

## Bugs
- [X] Fix authentication route bug
  * When you refresh on a page that requires authentication it redirects to the home page (this should not be the case if the session persists)
- [X] Bug where login error crashes app instead of displaying error
  - [X] 'Cannot set headers after they are sent' error crashes app
- [X] Persist issue, now it makes you log back in all the time. Perhaps passport session is very short?
- [X] Search doesn't redirect to page

## Features for next update
- [ ] Sendgrid configuration for sending emails
  - [ ] Contact us page
  - [ ] Confirm email page
  - [ ] Forgot password reset
- [ ] Make it easier for an admin to enter hours (some sort of autofill)
- [ ] Recommending content for users to look at
  * To begin they can be location based and random
- [ ] Split up `routes.js` into many smaller files
- [ ] Sort reviews functionality (time, rating)
- [ ] Give user model a "private" field (object containing info like password, email, etc) & have API not return it.
- [ ] Have listing location be a map picture
- [ ] Add author to listings and videos? At least on backend
- [ ] Improve search performance
- [ ] Delete reviews functionality
- [ ] Searching should not search through reviews

## Questions

* Should multiple curators be able to contribute to content or just one?
* What role should location play in the application?
  * How should we get a user's location?
  * Should all content have a location?
  * Should we only show content near the user?
* What information do you want on the about page?
