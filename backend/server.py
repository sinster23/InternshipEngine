from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pickle
from model import InternshipRecommendationModel, get_recommendations_for_flask, create_and_save_model

app = Flask(__name__)
CORS(app)  # This allows your React frontend to communicate with Flask

# Global variable to store the loaded model
model = None

def load_recommendation_model():
    """Load the trained model"""
    global model
    model_path = 'internship_model.pkl'
    
    # Check if model file exists, if not create it
    if not os.path.exists(model_path):
        print("🔄 Model file not found. Creating and training new model...")
        create_and_save_model(model_path)
    
    # Load the model
    try:
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        print("✅ Model loaded successfully!")
        return True
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return False

@app.route('/', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'success',
        'message': 'Internship Recommendation API is running!',
        'model_loaded': model is not None
    })

@app.route('/api/recommend', methods=['POST'])
def get_recommendations():
    """Main recommendation endpoint"""
    try:
        # Check if model is loaded
        if model is None:
            return jsonify({
                'success': False,
                'message': 'Model not loaded. Please restart the server.',
                'data': None
            }), 500

        # Get data from request
        data = request.get_json()
        
        # Validate required fields
        if not data or 'education' not in data or 'skills' not in data:
            return jsonify({
                'success': False,
                'message': 'Missing required fields: education and skills',
                'data': None
            }), 400

        education = data['education'].strip()
        skills = data['skills'].strip()
        top_n = data.get('top_n', 5)  # Default to 5 recommendations

        # Validate inputs
        if not education or not skills:
            return jsonify({
                'success': False,
                'message': 'Education and skills cannot be empty',
                'data': None
            }), 400

        # Get recommendations using the helper function
        result = get_recommendations_for_flask(model, education, skills, top_n)
        
        return jsonify(result)

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Internal server error: {str(e)}',
            'data': None
        }), 500

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get available internship categories"""
    try:
        if model is None or not model.is_trained:
            return jsonify({
                'success': False,
                'message': 'Model not loaded or trained',
                'data': None
            }), 500

        categories = list(model.internship_data['Category'].unique())
        return jsonify({
            'success': True,
            'message': 'Categories retrieved successfully',
            'data': {
                'categories': categories,
                'total_categories': len(categories)
            }
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error retrieving categories: {str(e)}',
            'data': None
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_model_stats():
    """Get model statistics"""
    try:
        if model is None or not model.is_trained:
            return jsonify({
                'success': False,
                'message': 'Model not loaded or trained',
                'data': None
            }), 500

        stats = {
            'total_internships': len(model.internship_data),
            'categories': list(model.internship_data['Category'].unique()),
            'locations': list(model.internship_data['Location'].unique()),
            'companies': list(model.internship_data['Company_Name'].unique()),
            'avg_duration': round(model.internship_data['Duration'].mean(), 1),
            'avg_stipend': round(model.internship_data['Stipend'].mean(), 0),
            'stipend_range': {
                'min': int(model.internship_data['Stipend'].min()),
                'max': int(model.internship_data['Stipend'].max())
            }
        }

        return jsonify({
            'success': True,
            'message': 'Statistics retrieved successfully',
            'data': stats
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error retrieving statistics: {str(e)}',
            'data': None
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'message': 'Endpoint not found',
        'data': None
    }), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        'success': False,
        'message': 'Method not allowed',
        'data': None
    }), 405

if __name__ == '__main__':
    print("🚀 Starting Internship Recommendation Server...")
    
    # Load the model on startup
    if load_recommendation_model():
        print("🎯 Server ready to serve recommendations!")
        print("📡 API Endpoints:")
        print("   GET  / - Health check")
        print("   POST /api/recommend - Get recommendations")
        print("   GET  /api/categories - Get available categories")
        print("   GET  /api/stats - Get model statistics")
        print("="*50)
        
        # Run the Flask app
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        print("❌ Failed to load model. Server not started.")