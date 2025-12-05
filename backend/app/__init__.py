from flask import Flask, request
from .config import Config
from .database import db
from flask_jwt_extended import JWTManager
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Configurar CORS ANTES de tudo
    CORS(app, 
         resources={r"/*": {"origins": "*"}},
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         supports_credentials=True)

    # extensões
    db.init_app(app)
    jwt = JWTManager(app)

    # Ignorar JWT para requests OPTIONS (preflight)
    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            return '', 204

    # blueprints
    from .routes.auth import bp as auth_bp
    from .routes.products import bp as products_bp
    from .routes.swagger_docs import docs_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(docs_bp)

    # criar tabelas 
    with app.app_context():
        db.create_all()

    return app