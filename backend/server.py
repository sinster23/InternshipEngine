from flask import Flask, request, jsonify
import pickle
import pandas as pd

app = Flask(__name__)

# 1. Load your trained model
with open("model.pkl", "rb") as f:   # replace with your file path
    model = pickle.load(f)

@app.route("/recommend", methods=["POST"])
def recommend():
    try:
        data = request.get_json()  # contains skills, location, experience

        #  Convert to DataFrame for model
        user_df = pd.DataFrame([data])

        recommendations = model.predict(user_df)

        return jsonify({
            "status": "success",
            "recommendations": recommendations.tolist()
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
