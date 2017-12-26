# Contract Work for Nalda

Technologies used: React, Redux, Passport, Node, Express, MongoDB

Link to timesheet:
https://docs.google.com/spreadsheets/d/1FaistICZ-BuORu7YYm5fFpgii2cvxZKgEpxApWQ_3pY/edit?usp=sharing

To start, run "npm start" or concurrently run "npm run frontend" and "npm run backend"

## TODO
- [ ] Admin add page (similar look to contact page) where admins can enter email addresses and add both other admins and other content curators. Only admins can add people as content curators and only content curators can create posts.
- [ ] Default create users with type “user”. Admin can switch them to “admin” or “curators”
- [ ] Protect admin, curator, and user routes.
- [ ] Allow admins to remove curators
- [ ] Add name field to user model in Mongo, population on screen: "Welcome, Adam"
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
- [ ] Potentially have a “join the team” page where it sends an email to them allowing them to add that person as a content curator. Maybe not for beta
- [ ] Store listing data better (array of times, ratings as numbers, need to store reviews/comments as well)
- [ ] Add author field to every posting
- [ ] Incorporate Nalda logo and other advice from edward
- [ ] Any sort of recommendations??? Probably not for beta tbh
- [ ] Fix authentication route bug (when you refresh on a page that requires authentication it redirects to home page????)
- [ ] Contact form actually sends them an email
- [ ] Forgot password send email reset
- [ ] Change password backend and frontend
- [ ] HTTPS?
- [ ] Domain registration


## Frontend

- [x] Setting up SCSS
- [ ] Video styling
- [ ] Login/Register/Reset/Edit Account Form styling
- [ ] Sendgrid configuration for sending emails
- [ ] Individual listing view
- [ ] Ajax search suggestions
- [ ] Routing 	
- [ ] User show pages
- [X] Footer
- [ ] Homepage display (mobile and desktop)
- [X] Article form display
- [X] Video form display
- [X] Listing form display
- [ ] General Design Updates/finishing touches

## Backend

- [X] Boilerplate setup
- [X] MongoDB setup
- [X] React/Redux setup
- [X] Setting up Component Structures
- [X] Password security
- [ ] HTTPS
- [X] User Authentication
- [ ] Articles/Listing Backend
- [ ] Video
- [ ] Searching Functionality
- [X] Nav bar
- [ ] Recommendations
- [ ] Storing hours
- [ ] Domain registration/setup
- [X] API Routing
- [ ] Linking frontend and backend
