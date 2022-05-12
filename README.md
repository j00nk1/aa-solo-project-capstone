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

#### Challenge:

This page was actually the hardest part for me to implement and to determine whether the user has already played the quote or not since the quote table doesn’t have the user id or record id and couldn’t render properly. My initial approach was to use the useState hook that checks the record table associated with the session user’s id and each quote’s id. However, because I used the hook inside of the map function on the quotes, the state gets updated in every iteration and triggered too many re-renders and that caused an infinite loop in React.

#### Solution:

To avoid the infinite loop, I created a custom function called `hasPlayed` that takes a `quote_id` and session user’s `recordList` (grabbed from the redux state) as its parameters and returns `true` and set the `played` variable that was declared before the function to `true` if the record’s `quote_id` and the current `quote_id` matches. I also created the `setScore` function that takes a record and called in the `hasPlayed` function, so that I don’t have to call the `hasPlayed` function over and over in the component.

<!-- I think this is not an efficient way since the `hasPlayed` will iterate through the record at least once on every quote and that makes it O(n^2) time complexity. I should come up with the better solution such as making a new component and put it in the map call(right after the map), then use the useState to update the scores/play buttons -->

```js
let played; // initialized a variable that stores boolean & render scores if true
const hasPlayed = (quote_id, records = recordList) => {
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    if (record.quote_id === quote_id) {
      setScore(record);
      return true;
    }
  }
  played = false;
  return false;
};

// initialized variables here so that I can grab the info in the component
let wpm, accuracy, duration, record_id, updated_at;
const setScore = rec => {
  wpm = rec.wpm;
  accuracy = rec.accuracy;
  duration = rec.dur_time;
  record_id = rec.id;
  updated_at = rec.updated_at;
  played = true;
};
```

### Ranking Page

Users can see the quote's information and its top 10 highest scores.
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

(Other user's profile page)
![](/imgs/profile_others.png)
