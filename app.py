from flask import Flask, render_template, request

app = Flask(__name__) ## turn the current file into a flask app

@app.route("/") # create a route
def home():
    return render_template('home.html')


# @app.route('/greet', methods = ["POST"])
# def greet():
#     name = request.form.get("name", "world") # give a default name if it is not input by user
#     return render_template("greet.html", name=name)

if __name__ == '__main__':
    app.run(debug = True)