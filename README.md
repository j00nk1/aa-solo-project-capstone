# Quote-typing

[Quote-typing](https://quote-typing.herokuapp.com/) is a typing practice application where users can practice typing with famous quotes.
All quotes are fetched from[ZenQuotes.io](https://zenquotes.io/).

## Technologies

**Frontend**

- Node, HTML, REACT REDUX, CSS3,

**Backend**

- Python, Flask, PostgreSQL database

**Others**

- Docker
- Deployed with [Heroku](https://www.heroku.com/)

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

6. To run the React App in development, cd into the `react-app` directory and run your react app

   ```bash
   npm start
   ```

7. Navigate to http://localhost:3000/

8. You can use Demo-User to navigate through the site or you can create your own user.
