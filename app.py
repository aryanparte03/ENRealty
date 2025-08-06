from flask import Flask, render_template, request, flash, redirect, url_for
from flask_mail import Mail, Message
from datetime import datetime
import jsonify
import os

from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///enrealty.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')


# Email Configuration - UPDATE WITH YOUR APP PASSWORD
app.config['SECRET_KEY'] = '2ed6160070da41b3b69194076a1d3109'  # Change this to a secure secret key
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'partearyan713@gmail.com'
app.config['MAIL_PASSWORD'] = 'aepx nnss iefn ucai'  # Replace with your Gmail App Password
app.config['MAIL_DEFAULT_SENDER'] = 'partearyan713@gmail.com'

# Initialize Mail
mail = Mail(app)

db = SQLAlchemy(app)

# Import models AFTER db initialization (but still at module level)
with app.app_context():
    from models import Property, Contact, Newsletter


@app.route('/')
def home():
    # Get featured properties for the home page
    featured_properties = Property.query.filter_by(is_featured=True).limit(6).all()
    return render_template('index.html', properties=featured_properties)


@app.route('/listings')
def listings():
    return render_template('listings.html')


@app.route('/blogs')
def blogs():
    return render_template('blogs.html')


@app.route('/agents')
def agents():
    return render_template('agents.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        try:
            # Get form data
            request_type = request.form.get('request')
            full_name = request.form.get('fullName')
            phone_number = request.form.get('phoneNumber')
            email_address = request.form.get('emailAddress')
            message = request.form.get('message')

            # Create email message
            msg = Message(
                subject=f'New Contact Form Submission - {request_type}',
                recipients=['partearyan713@gmail.com'],
                html=f'''
                <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
                            New Contact Form Submission
                        </h2>

                        <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #1a1a1a;">Contact Details:</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; width: 150px;">Request Type:</td>
                                    <td style="padding: 8px 0;">{request_type}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold;">Full Name:</td>
                                    <td style="padding: 8px 0;">{full_name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                                    <td style="padding: 8px 0;"><a href="mailto:{email_address}">{email_address}</a></td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                                    <td style="padding: 8px 0;"><a href="tel:{phone_number}">{phone_number}</a></td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold;">Submitted:</td>
                                    <td style="padding: 8px 0;">{datetime.now().strftime('%B %d, %Y at %I:%M %p')}</td>
                                </tr>
                            </table>
                        </div>

                        <div style="background: #fff; padding: 20px; border-left: 4px solid #2563eb; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #1a1a1a;">Message:</h3>
                            <p style="margin-bottom: 0; line-height: 1.6;">{message if message else 'No message provided.'}</p>
                        </div>

                        <div style="margin-top: 30px; padding: 15px; background: #e3f2fd; border-radius: 5px;">
                            <p style="margin: 0; font-size: 14px; color: #1565c0;">
                                This email was sent from your ENRealty website contact form.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
                '''
            )

            # Send email
            mail.send(msg)

            return {'success': True, 'message': 'Message sent successfully! We\'ll get back to you soon.'}

        except Exception as e:
            print(f"Error sending email: {e}")
            return {'success': False, 'message': 'There was an error sending your message. Please try again.'}

    return render_template('contact.html')

@app.route('/privacy-policy')
def privacy_policy():
    return render_template('privacy.html')


@app.route('/search', methods=['POST'])
def search_properties():
    location = request.json.get('location')
    property_type = request.json.get('type')
    min_price = request.json.get('min_price')
    max_price = request.json.get('max_price')

    # Implement search logic here
    return jsonify({'message': 'Search functionality will be implemented'})


@app.route('/newsletter', methods=['POST'])
def newsletter_signup():
    email = request.json.get('email')
    if email:
        newsletter = Newsletter(email=email)
        db.session.add(newsletter)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Successfully subscribed!'})
    return jsonify({'success': False, 'message': 'Invalid email'})


@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)

