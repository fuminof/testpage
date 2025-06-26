from flask import Flask
from flask import request, make_response, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)


@app.route('/index', methods=['GET'])
def hello():
    text = 'Hello World'
    response = {'result': text}
    return make_response(jsonify(response))


@app.route('/helloworld', methods=['GET', 'POST'])
def index():
    text = 'Hello World'
    response = {'result': text}
    print(response)
    return make_response(jsonify(response))


@app.route("/post", methods=['GET', 'POST'])
def parse():
    data = request.get_json()
    text = data['post_text']
    response = {'result': text}
    print("data=", data)
    print("text=", text)
    return make_response(jsonify(response))


if __name__ == '__main__':
    app.run(debug=True, port=5000, threaded=True)
