from flask import Flask
from .config import Config
from .database import db
from flask_jwt_extended import JWTManager
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:4200"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # extensões
    db.init_app(app)
    JWTManager(app)

    # blueprints
    from .routes.auth import bp as auth_bp
    from .routes.products import bp as products_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)

    # criar tabelas 
    with app.app_context():
        db.create_all()

    return app