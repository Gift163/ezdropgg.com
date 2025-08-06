from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
from dotenv import load_dotenv
import jwt
from datetime import datetime, timedelta
import bcrypt

# Загружаем переменные окружения
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///ezdrop.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Инициализация расширений
db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)

# Модели базы данных
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    telegram_id = db.Column(db.String(50), unique=True, nullable=False)
    username = db.Column(db.String(100))
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    balance_ezcoin = db.Column(db.Float, default=0.0)
    balance_ezdrop = db.Column(db.Float, default=0.0)
    referral_code = db.Column(db.String(20), unique=True)
    referred_by = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

class NFT(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(500))
    rarity = db.Column(db.String(20))  # common, rare, epic, legendary
    value_ezcoin = db.Column(db.Float, default=0.0)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    is_for_sale = db.Column(db.Boolean, default=False)
    sale_price = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Case(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(500))
    price_ezcoin = db.Column(db.Float, nullable=False)
    rarity = db.Column(db.String(20))  # common, rare, epic, legendary
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    transaction_type = db.Column(db.String(20))  # deposit, withdraw, case_open, game_win, game_loss
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(10))  # EZCOIN, EZDROP, TON
    status = db.Column(db.String(20), default='pending')  # pending, completed, failed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Маршруты API
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow()})

@app.route('/api/auth/telegram', methods=['POST'])
def telegram_auth():
    data = request.get_json()
    
    # Здесь должна быть проверка подписи Telegram
    # Пока используем упрощенную версию
    
    telegram_id = data.get('id')
    username = data.get('username')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    
    user = User.query.filter_by(telegram_id=str(telegram_id)).first()
    
    if not user:
        # Создаем нового пользователя
        user = User(
            telegram_id=str(telegram_id),
            username=username,
            first_name=first_name,
            last_name=last_name,
            referral_code=generate_referral_code()
        )
        db.session.add(user)
        db.session.commit()
    
    # Обновляем время последнего входа
    user.last_login = datetime.utcnow()
    db.session.commit()
    
    # Создаем JWT токен
    token = jwt.encode(
        {
            'user_id': user.id,
            'telegram_id': user.telegram_id,
            'exp': datetime.utcnow() + timedelta(days=30)
        },
        app.config['SECRET_KEY'],
        algorithm='HS256'
    )
    
    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'telegram_id': user.telegram_id,
            'username': user.username,
            'balance_ezcoin': user.balance_ezcoin,
            'balance_ezdrop': user.balance_ezdrop,
            'referral_code': user.referral_code
        }
    })

@app.route('/api/user/profile', methods=['GET'])
def get_profile():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'No token provided'}), 401
    
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user = User.query.get(payload['user_id'])
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'id': user.id,
            'telegram_id': user.telegram_id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'balance_ezcoin': user.balance_ezcoin,
            'balance_ezdrop': user.balance_ezdrop,
            'referral_code': user.referral_code,
            'referred_by': user.referred_by,
            'created_at': user.created_at.isoformat(),
            'last_login': user.last_login.isoformat()
        })
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401

@app.route('/api/cases', methods=['GET'])
def get_cases():
    cases = Case.query.filter_by(is_active=True).all()
    return jsonify([{
        'id': case.id,
        'name': case.name,
        'description': case.description,
        'image_url': case.image_url,
        'price_ezcoin': case.price_ezcoin,
        'rarity': case.rarity
    } for case in cases])

@app.route('/api/cases/<int:case_id>/open', methods=['POST'])
def open_case(case_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'No token provided'}), 401
    
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user = User.query.get(payload['user_id'])
        case = Case.query.get(case_id)
        
        if not user or not case:
            return jsonify({'error': 'User or case not found'}), 404
        
        if user.balance_ezcoin < case.price_ezcoin:
            return jsonify({'error': 'Insufficient balance'}), 400
        
        # Логика открытия кейса (упрощенная версия)
        # В реальном проекте здесь будет сложная логика с шансами
        
        # Списываем стоимость кейса
        user.balance_ezcoin -= case.price_ezcoin
        
        # Генерируем случайный NFT (упрощенно)
        nft = generate_random_nft(user.id)
        
        # Записываем транзакцию
        transaction = Transaction(
            user_id=user.id,
            transaction_type='case_open',
            amount=-case.price_ezcoin,
            currency='EZCOIN',
            status='completed'
        )
        
        db.session.add(transaction)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'nft': {
                'id': nft.id,
                'name': nft.name,
                'description': nft.description,
                'image_url': nft.image_url,
                'rarity': nft.rarity,
                'value_ezcoin': nft.value_ezcoin
            },
            'new_balance': user.balance_ezcoin
        })
        
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401

# Вспомогательные функции
def generate_referral_code():
    import random
    import string
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

def generate_random_nft(user_id):
    # Упрощенная логика генерации NFT
    # В реальном проекте здесь будет сложная система с шансами
    nft_names = ['Cyber Sword', 'Neon Shield', 'Digital Crown', 'Quantum Gem']
    rarities = ['common', 'rare', 'epic', 'legendary']
    
    nft = NFT(
        name=random.choice(nft_names),
        description='A mysterious NFT from the future',
        image_url='/assets/nft-placeholder.png',
        rarity=random.choice(rarities),
        value_ezcoin=random.uniform(10, 1000),
        owner_id=user_id
    )
    
    db.session.add(nft)
    db.session.commit()
    return nft

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000) 