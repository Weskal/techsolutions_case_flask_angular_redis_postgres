from flask import Blueprint
from flask_restx import Api, Resource, fields
from flask_jwt_extended import jwt_required

# Blueprint para docs
docs_bp = Blueprint('docs', __name__, url_prefix='/api')

# Configurar API com Swagger
api = Api(
    docs_bp,
    version='1.0',
    title='Shark Gaming API',
    description='API para gerenciamento de produtos da Shark Gaming',
    doc='/docs',  # URL do Swagger UI
    authorizations={
        'Bearer': {
            'type': 'apiKey',
            'in': 'header',
            'name': 'Authorization',
            'description': 'JWT Token no formato: Bearer <token>'
        }
    },
    security='Bearer'
)

# Namespaces (grupos de endpoints)
ns_auth = api.namespace('auth', description='Autenticação')
ns_products = api.namespace('products', description='Gerenciamento de produtos')

# Modelos para documentação
login_model = api.model('Login', {
    'username': fields.String(required=True, description='Nome de usuário'),
    'password': fields.String(required=True, description='Senha')
})

register_model = api.model('Register', {
    'username': fields.String(required=True, description='Nome de usuário'),
    'password': fields.String(required=True, description='Senha')
})

product_model = api.model('Product', {
    'id': fields.Integer(readonly=True, description='ID do produto'),
    'name': fields.String(required=True, description='Nome do produto'),
    'brand': fields.String(description='Marca do produto'),
    'price': fields.Float(required=True, description='Preço do produto'),
    'created_at': fields.DateTime(readonly=True),
    'updated_at': fields.DateTime(readonly=True)
})

product_input = api.model('ProductInput', {
    'name': fields.String(required=True, description='Nome do produto'),
    'brand': fields.String(description='Marca do produto'),
    'price': fields.Float(required=True, description='Preço do produto')
})

# Endpoints documentados (exemplos)
@ns_auth.route('/login')
class LoginResource(Resource):
    @ns_auth.doc('login')
    @ns_auth.expect(login_model)
    @ns_auth.response(200, 'Login bem-sucedido')
    @ns_auth.response(401, 'Credenciais inválidas')
    def post(self):
        '''Fazer login e obter token JWT'''
        pass

@ns_auth.route('/register')
class RegisterResource(Resource):
    @ns_auth.doc('register')
    @ns_auth.expect(register_model)
    @ns_auth.response(201, 'Usuário criado')
    @ns_auth.response(400, 'Usuário já existe')
    def post(self):
        '''Registrar novo usuário'''
        pass

@ns_products.route('/')
class ProductListResource(Resource):
    @ns_products.doc('list_products', security='Bearer')
    @ns_products.marshal_list_with(product_model)
    @ns_products.response(200, 'Lista de produtos')
    @ns_products.response(401, 'Não autenticado')
    @jwt_required()
    def get(self):
        '''Listar todos os produtos'''
        pass

    @ns_products.doc('create_product', security='Bearer')
    @ns_products.expect(product_input)
    @ns_products.response(202, 'Produto enfileirado para criação')
    @ns_products.response(400, 'Dados inválidos')
    @jwt_required()
    def post(self):
        '''Criar novo produto (assíncrono via Redis)'''
        pass

@ns_products.route('/<int:id>')
@ns_products.param('id', 'ID do produto')
class ProductResource(Resource):
    @ns_products.doc('update_product', security='Bearer')
    @ns_products.expect(product_input)
    @ns_products.response(202, 'Produto enfileirado para atualização')
    @ns_products.response(404, 'Produto não encontrado')
    @jwt_required()
    def put(self, id):
        '''Atualizar produto (assíncrono via Redis)'''
        pass

    @ns_products.doc('delete_product', security='Bearer')
    @ns_products.response(202, 'Produto enfileirado para exclusão')
    @ns_products.response(404, 'Produto não encontrado')
    @jwt_required()
    def delete(self, id):
        '''Deletar produto (assíncrono via Redis)'''
        pass