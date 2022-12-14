import logging

from tkinter import W
from flask import Flask, render_template, request

app = Flask(__name__) ## turn the current file into a flask app


@app.route("/") # create a route
def home():
    return render_template('about.html')

@app.route('/resume')
def resume():
    return render_template('resume.html')

@app.route('/illustration')
def illustration():
    return render_template('illustration.html')


@app.route('/game')
def game():
    return render_template('game.html')


@app.route('/cat')
def cat():
    return render_template('/cat.html')


@app.route('/contact')
def contact():
    return render_template('contact.html')

if __name__ == '__main__':
    logging.basicConfig(filename='web.log',level=logging.DEBUG)
    app.run(debug = True)