# Quote-typing

[Quote-typing](https://quote-typing.herokuapp.com/) is a typing practice application where users can practice typing with famous quotes.
Most of the quotes are fetched from[ZenQuotes.io](https://zenquotes.io/).

## Technologies

**Frontend**

- Node, HTML, REACT REDUX, CSS3,

**Backend**

- Python, Flask, SQLAlchemy, PostgreSQL database

**Others**

- Docker
- Deployed with [Heroku](https://www.heroku.com/)
- Typing game functionality: [React-typing-game-hook](https://github.com/jokarz/react-typing-game-hook)

## Getting Started

1. Clone this repository

   ```bash
   git clone git@github.com:j00nk1/aa-solo-project-capstone.git
   ```

2. Install dependencies

   ```bash
   pipenv install --dev -r dev-requirements.txt && pipenv install -r requirements.txt
   ```

3. Create a **.env** file based on the example with proper settings for your development environment

4. Setup your PostgreSQL user, password and database and make sure it matches your **.env** file

5. Get into your pipenv, migrate your database, seed your database, and run your flask app

   ```bash
   pipenv shell
   ```

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   flask run
   ```

6. To run the React App in development, cd into the `react-app` directory and install the dependencies, then run your react app

   ```bash
   npm install
   npm start
   ```

7. Navigate to http://localhost:3000/

8. You can use Demo-User to navigate through the site or you can create your own user.

## Features

### Quote List(landing page)

Users can see all the quotes and button(s) on each quote. Also users can see the records if they have already played the quotes before.

- By clicking on a quote section, it will take users to the quote's ranking page.
- By clicking on the "play" or "play again" button, it will take users to the typing game page.
- By clicking on the "delete" button, an alert will pop up to confirm the deletion and delete the record if confirmed.

![qt_landing](/imgs/qt_landing.png)

### Ranking Page

Users can see the quote's information and the top 10 highest scores of the quote.
Users can go to the quote's typing game page from this page by clicking on "play" or "play again" button.
User can also go to other user's profile page by clicking on their record section.
![](/imgs/qt_ranking.png)

### Typing Game Page

Users can start typing by clicking on the quote box.
As they finish typing, the score will be rendered, and they can submit to save the score.
![](/imgs/typing_first_time.gif)

If the user has already played the quotes, it will render their previous record and compare with the new record.
![](/imgs/typing_second_time.gif)

## Profile Page

In the profile page, users can see their own status and records as well as comments on the records.

(Logged-in user's profile page)
![](/imgs/profile_sessionuser.png)

**Record Section**

- Users can delete their own records in this page by clicking on the "delete" button.
- Users can play the game again by clicking on "play again" button.
- Users can go to the quote's ranking page by clicking on the record section(not the buttons)

**Comment Section**

- Users can write a comment on the record.
- Users can edit/delete their own comment.(They can't edit/delete other users' comments)

(Other user's)
![](/imgs/profile_others.png)
