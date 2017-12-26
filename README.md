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

## TODO
- [ ] Admin add page (similar look to contact page) where admins can enter email addresses and add both other admins and other content creators. Only admins can add people as content creators and only content creators can create posts.
- [ ] Default create users with type “user”. Admin can switch them to “admin” or “creator”
- [ ] Protect admin, creator, and user routes.
- [ ] Allow users to leave reviews: comments and ratings.
- [ ] Complete listing backend (already stores listing in Mongo, just need to populate to home screen.
- [ ] Complete individual listing view
- [ ] Video backend
- [ ] Video frontend
- [ ] Search bar and functionality on home page
- [ ] Make sort by recent actually work (give everything posted a time stamp)
- [ ] Home page needs to have other ways of sorting: most popular, by category, by author?, etc
- [ ] Make it so when you post an article or listing it uses real user data and time of posting when showing author
- [ ] Style “about” page. (Need a few paragraphs from nalda about the company)
- [ ] Potentially have a “join the team” page where it sends an email to them allowing them to add that person as a content editor. Maybe not for beta

## Users

- [ ] SendGrid configuration
  - [ ] Contact page
  - [ ] Password reset
  - [ ] Device authorization (confirm your email)?
- [ ] Add author field to every form of content
  - [ ] Videos
  - [ ] Listings
  - [ ] Articles

## Listings

- [ ] Store an array of times or two fields for each day
- [ ] Store reviews / comments on listings
- [ ] Form for adding reviews

## Videos

- [ ] Improve styling

## Frontend

- [X] Footer
- [X] Article form display
- [X] Video form display
- [X] Listing form display
- [ ] Login/Register/Reset/Edit Account Form styling
- [ ] Individual listing view
- [ ] Ajax search suggestions
- [ ] Curator show pages
  * This should display all of the content a curator has written
- [ ] Incorporate Nalda logo and other advice from Edward

## Backend

- [X] Boilerplate setup
- [X] MongoDB setup
- [X] React/Redux setup
- [X] Setting up component structures
- [X] Password security
- [ ] HTTPS
- [ ] Searching functionality
  * A user should be able to search for `articles`, `videos`, `listings`, and `curators` (those who create content).
- [ ] Recommending content for users to look at
  * To begin they can be location based and random
- [ ] Domain registration/setup
- [ ] Better user auth checks on the backend
- [ ] Better parameter error checking on the backend

## Other

- [ ] Make a check in the `AppContainer` component to ensure that `passport` and `redux` are in sync (`redux persist`) makes it such that this can outlast the backend session

## Bugs
- [ ] Fix authentication route bug
  * When you refresh on a page that requires authentication it redirects to the home page (this should not be the case if the session persists)

## Questions

* Should multiple curators be able to contribute to content or just one?
* What role should location play in the application?
  * How should we get a user's location?
  * Should all content have a location?
  * Should we only show content near the user?
