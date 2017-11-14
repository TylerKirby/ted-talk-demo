from flask import request, render_template, jsonify, url_for, redirect, g
from .models import User, Transcripts
from index import app, db
from sqlalchemy.exc import IntegrityError
from .utils.auth import generate_token, requires_auth, verify_token


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/<path:path>', methods=['GET'])
def any_root_path(path):
    return render_template('index.html')


@app.route("/api/user", methods=["GET"])
@requires_auth
def get_user():
    return jsonify(result=g.current_user)


@app.route("/api/create_user", methods=["POST"])
def create_user():
    incoming = request.get_json()
    user = User(
        email=incoming["email"],
        password=incoming["password"]
    )
    db.session.add(user)

    db.session.commit()

    new_user = User.query.filter_by(email=incoming["email"]).first()

    return jsonify(
        id=user.id,
        token=generate_token(new_user)
    )


@app.route("/api/get_token", methods=["POST"])
def get_token():
    incoming = request.get_json()
    user = User.get_user_with_email_and_password(incoming["email"], incoming["password"])
    if user:
        return jsonify(token=generate_token(user))

    return jsonify(error=True), 403


@app.route("/api/is_token_valid", methods=["POST"])
def is_token_valid():
    incoming = request.get_json()
    is_valid = verify_token(incoming["token"])

    if is_valid:
        return jsonify(token_is_valid=True)
    else:
        return jsonify(token_is_valid=False), 403

@app.route("/api/search_results", methods=["POST"])
def get_results():
    incoming = request.get_json()
    search_term = incoming["search"]
    # results = db.session.query(Transcripts).filter(Transcripts.transcript.contains(search_term))
    query = "SELECT * FROM Transcripts WHERE transcript LIKE \'%{0}%\'".format(search_term)
    query_result = db.session.execute(query)

    results = []
    for row in query_result.fetchall():
        result = {"id": row[0], "transcript": row[1], "url": row[2]}


    number_of_results = len(query_result.fetchall())
    return jsonify(
        numberOfResults=number_of_results
    )
