# TED Talk Reader #
The following build instructions have been tested on macOS 10.13.1.

Begin by cloning the repo and then `cd tedTalkDemo`.

### Create DB
First make sure you have [MySQL](https://dev.mysql.com/downloads/mysql/) installed locally.

Install the `mysql` CLI via brew: `brew install mysql`

Log into mysql with `mysql -u YOUR_USERNAME -p` and provide your password.

Create database with `create database mydatabase`. Be sure to call database `mydatabase`.

In the `config.py` file under the root directory, replace the `DATABASE_URL` with `mysql+mysqlconnector://YOUR_USERNAME:YOUR_PASSWORD@localhost/mydatabase`. Be sure to use your actual MySQL username and password here.

Once complete, be sure to start your MySQl server: `brew services start mysql`

You should be up and running with MySQL now!

### Install Flask Application
Create a virtual environment and install the required packages as below.
```sh
$ pip2 install virtualenv
$ virtualenv venv --distribute
$ source venv/bin/activate
$ sudo pip2 install -r requirements.txt
$ sudo pip2 install --egg mysql-connector-python-rf
```

Run the db setup and server start scripts:
```sh
$ python2 manage.py create_db
$ python2 manage.py runserver
```

Note that the app requires Python 2.7. Be sure that all of the packages are installed for Python 2.7.

The server will print the number of rows of transcripts inserted into the db once the db is set up.

The Flask app listens on `localhost:5000`.


### Install React Application
Use npm to install and start the React app.
```sh
$ cd static
$ npm install
$ npm start
```

### Using the App
Once installed, navigate to the registration screen [application](http://localhost:3000) and register with any email and password. Then you should be taken to the search screen where you can search TED Talks

I used https://github.com/dternyak/React-Redux-Flask to bootstrap the app and https://www.kaggle.com/rounakbanik/ted-talks for the data.
