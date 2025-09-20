import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pickle
import re
import os
import warnings
warnings.filterwarnings('ignore')

def clean_text(text):
    """Clean and preprocess text data"""
    if pd.isna(text) or text is None:
        return ""

    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = ' '.join(text.split())
    return text

class InternshipRecommendationModel:
    """Complete recommendation model that can be saved as a single pickle file"""

    def __init__(self):  # Fixed: __init__ instead of _init_
        self.tfidf_education = None
        self.tfidf_skills = None
        self.tfidf_combined = None
        self.rf_classifier = None
        self.internship_data = None
        self.education_matrix = None
        self.skills_matrix = None
        self.combined_matrix = None
        self.is_trained = False

    def create_sample_data(self):
        """Create sample internship dataset with exactly matching array lengths"""

        # Create exactly 30 internship records (balanced across categories)
        sample_data = {
            'Education': [
                # Software/Development (8 samples)
                'Computer Science Engineering Bachelor',
                'Information Technology Bachelor',
                'Computer Science Masters',
                'Software Engineering Bachelor',
                'Computer Engineering Bachelor',
                'Information Technology Masters',
                'Computer Applications Bachelor',
                'Information Systems Bachelor',

                # Data Science/Analytics (7 samples)
                'Data Science Masters',
                'Data Science Bachelor',
                'Statistics Masters',
                'Mathematics Bachelor',
                'Statistics Bachelor',
                'Computer Science Masters',
                'Applied Mathematics Masters',

                # Business/Finance/Marketing (7 samples)
                'Business Administration MBA',
                'Marketing Bachelor',
                'Finance Bachelor',
                'Economics Bachelor',
                'Commerce Bachelor',
                'Management Studies Bachelor',
                'Business Analytics Masters',

                # Engineering (5 samples)
                'Mechanical Engineering Bachelor',
                'Electronics Engineering Bachelor',
                'Civil Engineering Bachelor',
                'Electrical Engineering Bachelor',
                'Mechanical Engineering Masters',

                # Other/Research (3 samples)
                'Psychology Bachelor',
                'Biology Masters',
                'Chemistry Bachelor'
            ],
            'Skills': [
                # Software/Development (8 samples)
                'Python Django React JavaScript Git',
                'Java Spring Boot Database MySQL',
                'HTML CSS JavaScript Node.js MongoDB',
                'C++ Java Python Git Agile Development',
                'React Angular TypeScript Express.js',
                'Python Flask PostgreSQL Redis Docker',
                'PHP Laravel MySQL Bootstrap jQuery',
                'ASP.NET C# SQL Server Entity Framework',

                # Data Science/Analytics (7 samples)
                'Python Machine Learning Data Analysis SQL',
                'Python R Statistics Deep Learning TensorFlow',
                'Python Pandas NumPy Matplotlib Jupyter',
                'R Statistics Machine Learning Tableau',
                'Python Scikit-learn Keras PyTorch SQL',
                'SQL Power BI Excel Data Visualization',
                'Python Statistics Regression Analysis SPSS',

                # Business/Finance/Marketing (7 samples)
                'Project Management Leadership Communication',
                'Digital Marketing SEO Social Media Analytics',
                'Financial Analysis Excel VBA Bloomberg',
                'Market Research Data Analysis Excel PowerBI',
                'Business Analysis SQL Tableau Excel',
                'Strategic Planning Management Consulting',
                'Financial Modeling Excel Python Bloomberg',

                # Engineering (5 samples)
                'AutoCAD SolidWorks Design Manufacturing',
                'Circuit Design PCB MATLAB Embedded Systems',
                'AutoCAD Revit Project Planning Construction',
                'Power Systems MATLAB Simulink Control Systems',
                'ANSYS CATIA Design Analysis Manufacturing',

                # Other/Research (3 samples)
                'Research Statistics SPSS Data Collection',
                'Laboratory Research Data Analysis Statistics',
                'Research Methodology Statistics R Python'
            ],
            'Location': [
                # 30 locations matching the 30 records above
                'Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad',
                'Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad', 'Chennai', 'Bangalore',
                'Mumbai', 'Delhi', 'Pune', 'Hyderabad', 'Chennai', 'Bangalore', 'Mumbai',
                'Delhi', 'Pune', 'Hyderabad', 'Chennai', 'Bangalore',
                'Mumbai', 'Delhi', 'Pune'
            ],
            'Duration': [
                # 30 durations (in months)
                6, 3, 4, 6, 3, 6, 4, 6,  # Software (8)
                6, 4, 3, 6, 4, 6, 3,     # Data (7)
                6, 4, 6, 3, 6, 4, 3,     # Business (7)
                6, 4, 6, 3, 6,           # Engineering (5)
                4, 3, 6                  # Other (3)
            ],
            'Stipend': [
                # 30 stipends (in INR)
                28000, 15000, 16000, 26000, 18000, 30000, 20000, 32000,  # Software (8)
                25000, 30000, 20000, 22000, 28000, 35000, 27000,         # Data (7)
                20000, 12000, 24000, 18000, 22000, 19000, 25000,         # Business (7)
                22000, 18000, 20000, 22000, 25000,                       # Engineering (5)
                15000, 18000, 16000                                      # Other (3)
            ],
            'Internship_Title': [
                # Software/Development (8 samples)
                'Full Stack Developer Intern',
                'Software Development Intern',
                'Web Development Intern',
                'Software Engineer Intern',
                'Frontend Developer Intern',
                'Backend Developer Intern',
                'PHP Developer Intern',
                'ASP.NET Developer Intern',

                # Data Science/Analytics (7 samples)
                'Machine Learning Intern',
                'Data Science Intern',
                'Data Analyst Intern',
                'Business Intelligence Intern',
                'AI Research Intern',
                'Data Visualization Intern',
                'Statistical Analyst Intern',

                # Business/Finance/Marketing (7 samples)
                'Business Analyst Intern',
                'Digital Marketing Intern',
                'Finance Analyst Intern',
                'Market Research Intern',
                'Business Development Intern',
                'Management Consultant Intern',
                'Financial Analyst Intern',

                # Engineering (5 samples)
                'Mechanical Design Intern',
                'Electronics Engineering Intern',
                'Civil Engineering Intern',
                'Electrical Engineer Intern',
                'Design Engineer Intern',

                # Other/Research (3 samples)
                'Research Assistant Intern',
                'Lab Research Intern',
                'Research Analyst Intern'
            ],
            'Company_Name': [
                # Software (8)
                'WebDev Studios', 'DevSolutions', 'CodeCraft', 'SoftTech', 'TechFlow', 'DevCorp', 'WebMakers', 'TechSoft',
                # Data Science (7)
                'TechCorp AI', 'DataTech Labs', 'Analytics Plus', 'DataViz Inc', 'ML Solutions', 'DataSight', 'AI Innovations',
                # Business (7)
                'BusinessPro', 'DigitalBoost', 'FinanceMax', 'MarketPro', 'BizAnalytics', 'ConsultCorp', 'FinTech Solutions',
                # Engineering (5)
                'MechDesign Inc', 'ElectroTech', 'BuildRight', 'PowerSystems', 'EngiCorp',
                # Other (3)
                'ResearchLab', 'BioTech Labs', 'ScienceHub'
            ]
        }

        # Verify all arrays have the same length
        lengths = {key: len(value) for key, value in sample_data.items()}
        print(f"Array lengths: {lengths}")

        # Check if all lengths are equal
        unique_lengths = set(lengths.values())
        if len(unique_lengths) != 1:
            raise ValueError(f"Array length mismatch: {lengths}")

        return pd.DataFrame(sample_data)

    def train_model(self, data=None):
        """Train the complete recommendation model"""

        if data is None:
            self.internship_data = self.create_sample_data()
        else:
            self.internship_data = data

        print(f"Training model with {len(self.internship_data)} internship records...")

        # Clean text data
        self.internship_data['Education_Clean'] = self.internship_data['Education'].apply(clean_text)
        self.internship_data['Skills_Clean'] = self.internship_data['Skills'].apply(clean_text)
        self.internship_data['Combined_Features'] = (
            self.internship_data['Education_Clean'] + ' ' +
            self.internship_data['Skills_Clean']
        )

        # Create TF-IDF vectorizers
        self.tfidf_education = TfidfVectorizer(stop_words='english', max_features=1000)
        self.tfidf_skills = TfidfVectorizer(stop_words='english', max_features=1000)
        self.tfidf_combined = TfidfVectorizer(stop_words='english', max_features=2000)

        # Fit and transform
        self.education_matrix = self.tfidf_education.fit_transform(self.internship_data['Education_Clean'])
        self.skills_matrix = self.tfidf_skills.fit_transform(self.internship_data['Skills_Clean'])
        self.combined_matrix = self.tfidf_combined.fit_transform(self.internship_data['Combined_Features'])

        # Create categories for classification
        categories = {
            'software': ['software', 'development', 'web', 'full stack', 'frontend', 'backend', 'php', 'asp.net'],
            'data': ['data', 'machine learning', 'analytics', 'intelligence', 'visualization', 'statistical'],
            'business': ['business', 'analyst', 'finance', 'marketing', 'development', 'consultant', 'financial'],
            'engineering': ['mechanical', 'electronics', 'civil', 'electrical', 'design', 'product']
        }

        def categorize_internship(title):
            title_lower = title.lower()
            for category, keywords in categories.items():
                if any(keyword in title_lower for keyword in keywords):
                    return category
            return 'other'

        self.internship_data['Category'] = self.internship_data['Internship_Title'].apply(categorize_internship)

        # Train classification model
        self.rf_classifier = RandomForestClassifier(n_estimators=100, random_state=42)
        X = self.combined_matrix.toarray()
        y = self.internship_data['Category']

        # Simple train-test split
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        self.rf_classifier.fit(X_train, y_train)

        # Calculate accuracy
        train_accuracy = self.rf_classifier.score(X_train, y_train)
        test_accuracy = self.rf_classifier.score(X_test, y_test) if len(X_test) > 0 else train_accuracy

        print(f"✅ Model trained successfully!")
        print(f"📊 Training Accuracy: {train_accuracy:.3f}")
        print(f"📊 Test Accuracy: {test_accuracy:.3f}")
        print(f"📈 Categories: {list(self.internship_data['Category'].unique())}")

        self.is_trained = True
        return self

    def predict(self, user_education, user_skills, top_n=5):
        """Make predictions for user input"""

        if not self.is_trained:
            raise Exception("Model not trained. Call train_model() first.")

        # Clean user input
        user_education_clean = clean_text(user_education)
        user_skills_clean = clean_text(user_skills)
        user_combined = user_education_clean + ' ' + user_skills_clean

        # Transform user input
        user_education_vec = self.tfidf_education.transform([user_education_clean])
        user_skills_vec = self.tfidf_skills.transform([user_skills_clean])
        user_combined_vec = self.tfidf_combined.transform([user_combined])

        # Calculate similarities
        education_sim = cosine_similarity(user_education_vec, self.education_matrix).flatten()
        skills_sim = cosine_similarity(user_skills_vec, self.skills_matrix).flatten()
        combined_sim = cosine_similarity(user_combined_vec, self.combined_matrix).flatten()

        # Weighted combination (40% skills, 30% education, 30% combined)
        final_similarity = (0.30 * education_sim + 0.40 * skills_sim + 0.30 * combined_sim)

        # Get top recommendations
        top_indices = final_similarity.argsort()[-top_n:][::-1]

        # Predict category
        predicted_category = self.rf_classifier.predict(user_combined_vec.toarray())[0]
        category_proba = self.rf_classifier.predict_proba(user_combined_vec.toarray())[0]
        confidence = max(category_proba)

        # Build recommendations
        recommendations = []
        for idx in top_indices:
            row = self.internship_data.iloc[idx]
            rec = {
                'title': row['Internship_Title'],
                'company': row['Company_Name'],
                'location': row['Location'],
                'duration_months': int(row['Duration']),
                'stipend_inr': int(row['Stipend']),
                'education_required': row['Education'],
                'skills_required': row['Skills'],
                'match_score': round(float(final_similarity[idx]) * 100, 1),
                'similarity': float(final_similarity[idx])
            }
            recommendations.append(rec)

        return {
            'status': 'success',
            'user_profile': {
                'education': user_education,
                'skills': user_skills
            },
            'predicted_category': predicted_category,
            'category_confidence': round(float(confidence) * 100, 1),
            'total_matches': len(recommendations),
            'recommendations': recommendations
        }

def create_and_save_model(filename='internship_model.pkl'):
    """Create, train and save the complete model as a single pickle file"""

    print("🚀 Creating and training internship recommendation model...")

    # Create and train model
    model = InternshipRecommendationModel()
    model.train_model()

    # Save as single pickle file
    with open(filename, 'wb') as f:
        pickle.dump(model, f, protocol=pickle.HIGHEST_PROTOCOL)

    print(f"✅ Model saved as '{filename}'")
    print(f"📁 File size: {round(os.path.getsize(filename) / (1024*1024), 2)} MB")

    # Test loading and prediction
    print("\n🧪 Testing model loading and prediction...")

    with open(filename, 'rb') as f:
        loaded_model = pickle.load(f)

    # Test prediction
    test_result = loaded_model.predict(
        user_education="Computer Science Bachelor",
        user_skills="Python Machine Learning JavaScript React",
        top_n=3
    )

    print(f"✅ Model loaded and tested successfully!")
    print(f"🎯 Test prediction category: {test_result['predicted_category']}")
    print(f"📊 Test confidence: {test_result['category_confidence']}%")
    print(f"📋 Test recommendations: {test_result['total_matches']}")

    return filename

def load_model(filename='internship_model.pkl'):
    """Load the saved model"""
    try:
        with open(filename, 'rb') as f:
            model = pickle.load(f)
        print(f"✅ Model loaded from '{filename}'")
        return model
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return None

# Flask Integration Helper Functions
def get_recommendations_for_flask(model, education, skills, top_n=5):
    """Helper function for Flask integration"""
    try:
        result = model.predict(education, skills, top_n)

        # Format for API response
        api_response = {
            'success': True,
            'message': 'Recommendations generated successfully',
            'data': {
                'predicted_category': result['predicted_category'],
                'confidence': f"{result['category_confidence']}%",
                'total_recommendations': result['total_matches'],
                'user_input': {
                    'education': education,
                    'skills': skills
                },
                'recommendations': [
                    {
                        'rank': i + 1,
                        'internship_title': rec['title'],
                        'company_name': rec['company'],
                        'location': rec['location'],
                        'duration_months': rec['duration_months'],
                        'stipend_inr': rec['stipend_inr'],
                        'match_percentage': f"{rec['match_score']}%",
                        'education_requirement': rec['education_required'],
                        'skills_requirement': rec['skills_required']
                    }
                    for i, rec in enumerate(result['recommendations'])
                ]
            }
        }
        return api_response

    except Exception as e:
        return {
            'success': False,
            'message': f'Error generating recommendations: {str(e)}',
            'data': None
        }

if __name__ == "__main__":  # Fixed: "__main__" instead of "_main_"
    # Create and save the model
    model_filename = create_and_save_model('internship_model.pkl')

    print("\n" + "="*60)
    print("🎉 SINGLE PKL FILE READY FOR FLASK INTEGRATION!")
    print("="*60)
    print(f"📁 Model file: {model_filename}")
    print(f"💾 Ready to use in your Flask application")