from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_restx import Api, Resource, fields
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://127.0.0.1:5173"]}}, supports_credentials=True)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///event_management.db'
app.config['JWT_SECRET_KEY'] = 'super-secret-key'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
jwt = JWTManager(app)

# Swagger configuration
authorizations = {
    'BearerAuth': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization',
        'description': 'Add "Bearer <your-token>"'
    }
}

api = Api(
    app,
    title="Event Management API",
    version="1.0",
    description="API for managing events, attendees, and tasks",
    authorizations=authorizations,
    security='BearerAuth'
)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(120), nullable=False)
    date = db.Column(db.DateTime, nullable=False)


class Attendee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=True)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    deadline = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), nullable=False, default="Pending")
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    attendee_id = db.Column(db.Integer, db.ForeignKey('attendee.id'), nullable=True)


# Namespaces
auth_ns = api.namespace('auth', description="Authentication APIs")
event_ns = api.namespace('events', description="Event Management APIs")
attendee_ns = api.namespace('attendees', description="Attendee Management APIs")
task_ns = api.namespace('tasks', description="Task Management APIs")

# Schemas
user_model = api.model('User', {
    'username': fields.String(required=True),
    'password': fields.String(required=True)
})

event_model = api.model('Event', {
    'name': fields.String(required=True),
    'description': fields.String(required=True),
    'location': fields.String(required=True),
    'date': fields.String(required=True)
})

attendee_model = api.model('Attendee', {
    'name': fields.String(required=True),
    'email': fields.String(required=True),
    'event_id': fields.Integer(required=False)
})

task_model = api.model('Task', {
    'name': fields.String(required=True),
    'deadline': fields.String(required=True),
    'status': fields.String(required=False, default="Pending"),
    'event_id': fields.Integer(required=True),
    'attendee_id': fields.Integer(required=False)
})

# Authentication
@auth_ns.route('/register')
class Register(Resource):
    @api.expect(user_model)
    def post(self):
        data = request.json
        if User.query.filter_by(username=data['username']).first():
            return {'message': 'User already exists'}, 400
        user = User(username=data['username'], password=data['password'])
        db.session.add(user)
        db.session.commit()
        return {'message': 'User registered successfully'}, 201

@auth_ns.route('/login')
class Login(Resource):
    @api.expect(user_model)
    def post(self):
        data = request.json
        user = User.query.filter_by(username=data['username'], password=data['password']).first()
        if not user:
            return {'message': 'Invalid credentials'}, 401
        token = create_access_token(identity=user.id)
        return {'token': token}, 200

# Event APIs
from datetime import datetime

@event_ns.route('/')
class EventList(Resource):
    @jwt_required()
    def get(self):
        events = Event.query.all()
        return [{'id': event.id, 'name': event.name, 'description': event.description,
                 'location': event.location, 'date': event.date.strftime('%Y-%m-%d')} for event in events], 200

    @jwt_required()
    @api.expect(event_model)
    def post(self):
        data = request.json
        try:
            # Convert the date string to a datetime object
            event_date = datetime.strptime(data['date'], '%d-%m-%Y')
        except ValueError:
            return {'message': 'Invalid date format. Use DD-MM-YYYY'}, 400

        event = Event(name=data['name'], description=data['description'],
                      location=data['location'], date=event_date)
        db.session.add(event)
        db.session.commit()
        return {'message': 'Event created successfully'}, 201


# Attendee APIs
@attendee_ns.route('/')
class AttendeeList(Resource):
    @jwt_required()
    def get(self):
        attendees = Attendee.query.all()
        return [{'id': attendee.id, 'name': attendee.name, 'email': attendee.email, 'event_id': attendee.event_id}
                for attendee in attendees], 200

    @jwt_required()
    @api.expect(attendee_model)
    def post(self):
        data = request.json
        attendee = Attendee(name=data['name'], email=data['email'], event_id=data.get('event_id'))
        db.session.add(attendee)
        db.session.commit()
        return {'message': 'Attendee added successfully'}, 201

@attendee_ns.route('/<int:id>')
class AttendeeResource(Resource):
    @jwt_required()
    def delete(self, id):
        attendee = Attendee.query.get(id)
        if not attendee:
            return {'message': 'Attendee not found'}, 404
        db.session.delete(attendee)
        db.session.commit()
        return {'message': 'Attendee deleted successfully'}, 200

# Task APIs
@task_ns.route('/')
class TaskList(Resource):
    @jwt_required()
    @api.expect(task_model)
    def post(self):
        data = request.json
        try:
            # Convert deadline string to a datetime object
            deadline = datetime.strptime(data['deadline'], '%d-%m-%Y')
        except ValueError:
            return {'message': 'Invalid date format. Use DD-MM-YYYY.'}, 400

        task = Task(
            name=data['name'], 
            deadline=deadline, 
            status=data.get('status', 'Pending'),
            event_id=data['event_id'], 
            attendee_id=data.get('attendee_id')
        )
        db.session.add(task)
        db.session.commit()
        return {'message': 'Task created successfully'}, 201

@task_ns.route('/<int:event_id>')
class TaskByEvent(Resource):
    @jwt_required()
    def get(self, event_id):
        tasks = Task.query.filter_by(event_id=event_id).all()
        return [{'id': task.id, 'name': task.name, 'deadline': task.deadline.strftime('%Y-%m-%d'),
                 'status': task.status, 'event_id': task.event_id, 'attendee_id': task.attendee_id} for task in tasks], 200

status_model = api.model('UpdateStatus', {
    'status': fields.String(required=True, description="New status for the task")
})

@task_ns.route('/<int:id>/status')
class UpdateTaskStatus(Resource):
    @jwt_required()
    @api.expect(status_model)
    def put(self, id):
        data = request.json
        task = Task.query.get(id)
        if not task:
            return {'message': 'Task not found'}, 404
        task.status = data['status']
        db.session.commit()
        return {'message': 'Task status updated successfully'}, 200


if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Ensure this is within the app context
    app.run(host='0.0.0.0', port=5000, debug=True)

