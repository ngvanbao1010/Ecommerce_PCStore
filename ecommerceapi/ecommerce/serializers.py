from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Category, Product, Cart, Order, OrderDetail, Payment, Review, Comment, PCConfiguration


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    first_name = serializers.CharField(write_only=True, required=True)
    last_name = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 
                  'first_name', 'last_name', 'phone', 'address']
        extra_kwargs = {
            'username': {'required': False}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords don't match"})
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Email already exists."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        
        username = validated_data.get('username')
        if not username:
            username = validated_data['email'].split('@')[0]
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{validated_data['email'].split('@')[0]}{counter}"
                counter += 1
        
        user = User.objects.create(
            username=username,
            email=validated_data['email'],
            full_name=f"{first_name} {last_name}".strip(),
            phone=validated_data.get('phone', ''),
            address=validated_data.get('address', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            try:
                user_obj = User.objects.get(email=email)
            except User.DoesNotExist:
                raise serializers.ValidationError('Invalid credentials, please try again.')

            user = authenticate(username=user_obj.username, password=password)
            
            if not user:
                raise serializers.ValidationError('Invalid credentials, please try again.')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')
                
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Email and password are required.')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'phone', 'address', 'avatar', 'role', 'created_at']
        read_only_fields = ['id', 'username', 'role', 'created_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if instance.avatar and hasattr(instance.avatar, 'url') and request:
            data['avatar'] = request.build_absolute_uri(instance.avatar.url)
        return data

    def update(self, instance, validated_data):
        avatar = validated_data.get('avatar', None)
        if 'avatar' in validated_data and not avatar:
            if instance.avatar:
                instance.avatar.delete(save=False)
            validated_data.pop('avatar')
        return super().update(instance, validated_data)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at']


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'stock_quantity', 'category', 'category_name', 
                 'brand', 'specifications', 'image', 'is_active', 'average_rating', 'reviews_count', 'created_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request') if hasattr(self, 'context') else None
        img = data.get('image')
        if img and isinstance(img, str) and request and img.startswith('/'):
            data['image'] = request.build_absolute_uri(img)
        return data

    def get_average_rating(self, obj):
        val = getattr(obj, 'avg_rating', None)
        try:
            return float(val) if val is not None else (obj.average_rating or 0)
        except Exception:
            return 0

    def get_reviews_count(self, obj):
        count = getattr(obj, 'reviews_count', None)
        if count is not None:
            return count
        try:
            return obj.reviews.count()
        except Exception:
            return 0


class CartSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=12, decimal_places=2, read_only=True)
    product_image = serializers.ImageField(source='product.image', read_only=True)
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = ['id', 'product', 'product_name', 'product_price', 'product_image', 'quantity', 'total_price', 'created_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if data.get('product_image') and request and isinstance(data['product_image'], str):
            img = data['product_image']
            if img.startswith('/'):
                data['product_image'] = request.build_absolute_uri(img)
        return data


class OrderDetailSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = OrderDetail
        fields = ['id', 'product', 'product_name', 'quantity', 'unit_price', 'total_price']


class OrderSerializer(serializers.ModelSerializer):
    details = OrderDetailSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_full_name = serializers.CharField(source='user.full_name', read_only=True)
    user_phone = serializers.CharField(source='user.phone', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'order_number', 'status', 'payment_method', 'payment_status', 'user', 'user_name', 'user_full_name', 'user_phone',
                  'total_amount', 'shipping_address', 'notes', 'details', 'created_at', 'updated_at']
        read_only_fields = ['order_number', 'user']


class PaymentSerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source='order.order_number', read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'payment_method', 'status', 'order', 'order_number', 'payment_gateway_transaction_id',
                 'amount', 'currency', 'gateway_response', 'paid_at', 'created_at', 'updated_at']


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'product', 'product_name', 'user', 'user_name', 'rating', 'created_at']
        read_only_fields = ['user']


class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'product', 'user', 'user_name', 'parent_comment', 'comment_text', 
                 'is_staff_comment', 'replies', 'created_at']
        read_only_fields = ['user', 'is_staff_comment']

    def get_replies(self, obj):
        if obj.replies.exists():
            return CommentSerializer(obj.replies.all(), many=True).data
        return []


class PCConfigurationSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    component_details = serializers.SerializerMethodField()
    compatibility_info = serializers.SerializerMethodField()

    class Meta:
        model = PCConfiguration
        fields = ['id', 'user', 'user_name', 'name', 'components', 'component_details', 'compatibility_info',
                 'total_price', 'is_compatible', 'created_at']
        read_only_fields = ['user', 'total_price']

    def _normalize_components(self, comps):
        return comps if isinstance(comps, dict) else {}

    def create(self, validated_data):
        validated_data['components'] = self._normalize_components(validated_data.get('components'))
        obj = PCConfiguration.objects.create(**validated_data)
        try:
            obj.total_price = obj.calculate_total_price()
            comp = obj.check_compatibility()
            obj.is_compatible = comp.get('compatible', True)
            obj.save()
        except Exception:
            pass
        return obj

    def update(self, instance, validated_data):
        if 'components' in validated_data:
            instance.components = self._normalize_components(validated_data.get('components'))
        instance.name = validated_data.get('name', instance.name)
        try:
            instance.total_price = instance.calculate_total_price()
            comp = instance.check_compatibility()
            instance.is_compatible = comp.get('compatible', True)
        except Exception:
            pass
        instance.save()
        return instance

    def get_component_details(self, obj):
        details = []
        if not obj.components:
            return details
        for product, quantity, _ in obj._iter_components():
            details.append({
                'id': product.id,
                'name': product.name,
                'price': product.price,
                'quantity': quantity,
                'category': product.category.name if product.category else '',
                'brand': product.brand
            })
        return details

    def get_compatibility_info(self, obj):
        try:
            return obj.check_compatibility()
        except Exception:
            return {'compatible': obj.is_compatible, 'reasons': ['Compatibility check error']}
