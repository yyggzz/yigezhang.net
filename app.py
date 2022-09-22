from flask import Flask, render_template, request
from flask import send_from_directory

app = Flask(__name__) ## turn the current file into a flask app

@app.route("/") # create a route
def home():
    return render_template('about.html')

@app.route('/illustration')
def illustration():
    return render_template('illustration.html')

@app.route('/game')
def game():
    return render_template('game.html')

@app.route('/game/index.html')
def game_1():
    return render_template('/game/index.html')



@app.route('/contact')
def contact():
    return render_template('contact.html')

if __name__ == '__main__':
    app.run(debug = True)