from rest_framework import generics, status, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth import login
from django.utils import timezone
from datetime import datetime, time, timedelta
from django.db.models import Avg, Count, Q, Sum
from django.db.models.functions import TruncDate
import calendar

from .models import User, Category, Product, Cart, Order, OrderDetail, Payment, Review, Comment, PCConfiguration
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, UserSerializer,
    CategorySerializer, ProductSerializer, CartSerializer, OrderSerializer, OrderDetailSerializer,
    PaymentSerializer, ReviewSerializer, CommentSerializer, PCConfigurationSerializer
)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def logout_view(request):
    try:
        request.user.auth_token.delete()
    except:
        pass
    return Response({'message': 'Logged out successfully'})


@api_view(['GET'])
def profile(request):
    serializer = UserSerializer(request.user, context={'request': request})
    return Response(serializer.data)


@api_view(['PUT', 'PATCH'])
def update_profile(request):
    user = request.user
    data = request.data
    if data.get('clear_avatar') in ['true', '1', True]:
        if user.avatar:
            user.avatar.delete(save=False)
    updatable_simple = ['full_name', 'phone', 'address']
    changed = False
    for field in updatable_simple:
        if field in data and field != 'avatar':
            value = data.get(field)
            if value is not None:
                setattr(user, field, value)
                changed = True
    if 'avatar' in request.FILES:
        user.avatar = request.FILES['avatar']
        changed = True
    if changed:
        user.save()

    from django.conf import settings
    avatar_abs = ''
    if user.avatar:
        try:
            request_scheme = 'http'
            if request.is_secure():
                request_scheme = 'https'
            host = request.get_host()
            avatar_abs = f"{request_scheme}://{host}{user.avatar.url}"
        except Exception:
            avatar_abs = user.avatar.url if hasattr(user.avatar, 'url') else ''

    data_resp = UserSerializer(user, context={'request': request}).data
    if avatar_abs:
        data_resp['avatar'] = avatar_abs
    return Response(data_resp)


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_authenticated or getattr(user, 'role', 'customer') not in ['staff', 'admin']:
            raise permissions.PermissionDenied()
        serializer.save()


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_update(self, serializer):
        user = self.request.user
        if not user.is_authenticated or getattr(user, 'role', 'customer') not in ['staff', 'admin']:
            raise permissions.PermissionDenied()
        serializer.save()

    def perform_destroy(self, instance):
        user = self.request.user
        if not user.is_authenticated or getattr(user, 'role', 'customer') not in ['staff', 'admin']:
            raise permissions.PermissionDenied()
        instance.delete()


class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'brand']
    ordering_fields = ['name', 'price', 'created_at', 'avg_rating']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = (
            Product.objects.filter(is_active=True)
            .annotate(
                avg_rating=Avg('reviews__rating'),
                reviews_count=Count('reviews')
            )
        )
        
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category_id=category)
        
        brand = self.request.query_params.get('brand')
        if brand:
            queryset = queryset.filter(brand__icontains=brand)
        
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
            
        return queryset.select_related('category')


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]


class ProductCreateView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        if self.request.user.role not in ['staff', 'admin']:
            raise permissions.PermissionDenied()
        serializer.save()


class ProductUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_update(self, serializer):
        if self.request.user.role not in ['staff', 'admin']:
            raise permissions.PermissionDenied()
        serializer.save()
    
    def perform_destroy(self, instance):
        if self.request.user.role not in ['staff', 'admin']:
            raise permissions.PermissionDenied()
        instance.delete()


class CartListView(generics.ListAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user).select_related('product')


@api_view(['POST'])
def add_to_cart(request):
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity', 1)
    
    try:
        product = Product.objects.get(id=product_id, is_active=True)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if product.stock_quantity < quantity:
        return Response({'error': 'Not enough stock'}, status=status.HTTP_400_BAD_REQUEST)
    
    cart_item, created = Cart.objects.get_or_create(
        user=request.user, 
        product=product,
        defaults={'quantity': quantity}
    )
    
    if not created:
        cart_item.quantity += quantity
        if cart_item.quantity > product.stock_quantity:
            return Response({'error': 'Not enough stock'}, status=status.HTTP_400_BAD_REQUEST)
        cart_item.save()
    
    return Response(CartSerializer(cart_item, context={'request': request}).data)


@api_view(['PUT'])
def update_cart_item(request, pk):
    try:
        cart_item = Cart.objects.get(pk=pk, user=request.user)
    except Cart.DoesNotExist:
        return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)
    
    quantity = request.data.get('quantity')
    if quantity <= 0:
        cart_item.delete()
        return Response({'message': 'Item removed from cart'})
    
    if quantity > cart_item.product.stock_quantity:
        return Response({'error': 'Not enough stock'}, status=status.HTTP_400_BAD_REQUEST)
    
    cart_item.quantity = quantity
    cart_item.save()
    
    return Response(CartSerializer(cart_item, context={'request': request}).data)


@api_view(['DELETE'])
def remove_from_cart(request, pk):
    try:
        cart_item = Cart.objects.get(pk=pk, user=request.user)
        cart_item.delete()
        return Response({'message': 'Item removed from cart'})
    except Cart.DoesNotExist:
        return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        scope = self.request.query_params.get('scope')
        user = self.request.user
        base = Order.objects.all().select_related('user').prefetch_related('details__product')
        if getattr(user, 'role', 'customer') in ['staff', 'admin']:
            if scope == 'mine':
                return base.filter(user=user)
            return base
        return base.filter(user=user)


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role in ['staff', 'admin']:
            return Order.objects.all().select_related('user').prefetch_related('details__product')
        return Order.objects.filter(user=self.request.user).prefetch_related('details__product')


@api_view(['POST'])
def create_order(request):
    cart_items = Cart.objects.filter(user=request.user)
    if not cart_items.exists():
        return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
    
    total_amount = sum(item.total_price for item in cart_items)
    
    order_data = {
        'user': request.user.id,
        'payment_method': request.data.get('payment_method'),
        'total_amount': total_amount,
        'shipping_address': request.data.get('shipping_address'),
        'notes': request.data.get('notes', '')
    }
    
    order_serializer = OrderSerializer(data=order_data)
    if order_serializer.is_valid():
        order = order_serializer.save(user=request.user)
        for cart_item in cart_items:
            OrderDetail.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                unit_price=cart_item.product.price
            )
            cart_item.product.stock_quantity -= cart_item.quantity
            cart_item.product.save()
        cart_items.delete()
        
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
    
    return Response(order_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_order_status(request, pk):
    if getattr(request.user, 'role', 'customer') not in ['staff', 'admin']:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        order = Order.objects.get(pk=pk)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    
    new_status = request.data.get('status')
    if new_status in dict(Order._meta.get_field('status').choices):
        order.status = new_status
        if new_status == 'completed' and order.payment_status != 'completed':
            order.payment_status = 'completed'
        elif new_status == 'cancelled' and order.payment_status != 'cancelled':
            order.payment_status = 'cancelled'
        order.save()
        return Response(OrderSerializer(order).data)
    
    return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_payment_status(request, pk):
    if getattr(request.user, 'role', 'customer') not in ['staff', 'admin']:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

    try:
        order = Order.objects.get(pk=pk)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

    new_payment_status = request.data.get('payment_status')
    valid_payment_status = dict(Order._meta.get_field('payment_status').choices)
    if new_payment_status in valid_payment_status:
        order.payment_status = new_payment_status
        order.save()
        return Response(OrderSerializer(order).data)

    return Response({'error': 'Invalid payment_status'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def cancel_order(request, pk):
    try:
        order = Order.objects.get(pk=pk, user=request.user)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

    if order.status != 'pending':
        return Response({'error': 'Only pending orders can be cancelled'}, status=status.HTTP_400_BAD_REQUEST)

    order.status = 'cancelled'
    order.payment_status = 'cancelled'
    order.save()
    return Response(OrderSerializer(order).data)


class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        product_id = self.request.query_params.get('product_id')
        if product_id:
            return Review.objects.filter(product_id=product_id).select_related('user', 'product')
        return Review.objects.all().select_related('user', 'product')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        product_id = self.request.query_params.get('product_id')
        if product_id:
            return Comment.objects.filter(
                product_id=product_id, 
                parent_comment=None
            ).select_related('user', 'product').prefetch_related('replies__user')
        return Comment.objects.filter(parent_comment=None).select_related('user', 'product')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PCConfigurationListCreateView(generics.ListCreateAPIView):
    serializer_class = PCConfigurationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PCConfiguration.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PCConfigurationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PCConfigurationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PCConfiguration.objects.filter(user=self.request.user)


@api_view(['POST'])
def compare_products(request):
    product_ids = request.data.get('product_ids', [])
    if len(product_ids) < 2:
        return Response({'error': 'Need at least 2 products to compare'}, status=status.HTTP_400_BAD_REQUEST)
    
    products = Product.objects.filter(id__in=product_ids, is_active=True)
    if products.count() != len(product_ids):
        return Response({'error': 'Some products not found'}, status=status.HTTP_404_NOT_FOUND)
    
    categories = set(product.category.id for product in products)
    if len(categories) > 1:
        return Response({'error': 'Products must be in the same category'}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = ProductSerializer(products, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def sales_statistics(request):
    if getattr(request.user, 'role', 'customer') not in ['staff', 'admin']:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    period = request.query_params.get('period', 'daily')
    
    now = timezone.now()
    today = now.date()
    
    if period == 'daily':
        start_date = today
        start_dt = now.replace(hour=0, minute=0, second=0, microsecond=0)
        end_dt = start_dt + timedelta(days=1)
    elif period == 'monthly':
        start_date = today.replace(day=1)
        start_dt = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        if start_dt.month == 12:
            end_dt = start_dt.replace(year=start_dt.year + 1, month=1, day=1)
        else:
            end_dt = start_dt.replace(month=start_dt.month + 1, day=1)
    else:
        start_date = today.replace(month=1, day=1)
        start_dt = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
        end_dt = start_dt.replace(year=start_dt.year + 1)

    completed_q = Q(status='completed') | Q(payment_status='completed')

    base_q = Q(updated_at__gte=start_dt, updated_at__lt=end_dt) & completed_q

    orders = Order.objects.filter(base_q)

    agg = orders.aggregate(total_revenue=Sum('total_amount'), total_orders=Count('id'))
    total_revenue = agg.get('total_revenue') or 0
    total_orders = agg.get('total_orders') or 0

    def _num(v):
        try:
            return float(v)
        except Exception:
            return 0.0

    series = []
    if period == 'daily':
        by_hour = {h: {'revenue': 0.0, 'orders': 0} for h in range(24)}
        for o in orders.only('updated_at', 'total_amount').iterator():
            b = o.updated_at
            try:
                if timezone.is_aware(b):
                    b = timezone.localtime(b)
            except Exception:
                pass
            h = getattr(b, 'hour', None)
            if h is None:
                continue
            by_hour[h]['revenue'] += _num(getattr(o, 'total_amount', 0))
            by_hour[h]['orders'] += 1
        for h in range(24):
            vals = by_hour[h]
            series.append({'label': f"{h:02d}:00", 'revenue': vals['revenue'], 'orders': vals['orders']})
    elif period == 'monthly':
        days_in_month = calendar.monthrange(start_date.year, start_date.month)[1]
        by_day = {d: {'revenue': 0.0, 'orders': 0} for d in range(1, days_in_month + 1)}
        for o in orders.only('updated_at', 'total_amount').iterator():
            b = o.updated_at
            try:
                if timezone.is_aware(b):
                    b = timezone.localtime(b)
            except Exception:
                pass
            d = getattr(getattr(b, 'date', lambda: None)(), 'day', None) if hasattr(b, 'date') else getattr(b, 'day', None)
            if d is None:
                try:
                    d = b.day
                except Exception:
                    continue
            if 1 <= d <= days_in_month:
                by_day[d]['revenue'] += _num(getattr(o, 'total_amount', 0))
                by_day[d]['orders'] += 1
        for d in range(1, days_in_month + 1):
            series.append({'label': f"{start_date.year}-{start_date.month:02d}-{d:02d}", 'revenue': by_day[d]['revenue'], 'orders': by_day[d]['orders']})
    else:
        by_month = {m: {'revenue': 0.0, 'orders': 0} for m in range(1, 13)}
        for o in orders.only('updated_at', 'total_amount').iterator():
            b = o.updated_at
            try:
                if timezone.is_aware(b):
                    b = timezone.localtime(b)
            except Exception:
                pass
            m = getattr(b, 'month', None)
            if m is None or not (1 <= m <= 12):
                continue
            by_month[m]['revenue'] += _num(getattr(o, 'total_amount', 0))
            by_month[m]['orders'] += 1
        for m in range(1, 13):
            series.append({'label': f"{start_date.year}-{m:02d}", 'revenue': by_month[m]['revenue'], 'orders': by_month[m]['orders']})

    debug_counts = {
        'by_updated_range': Order.objects.filter(Q(updated_at__gte=start_dt, updated_at__lt=end_dt) & completed_q).count(),
    }
    sample = list(
        orders.order_by('-updated_at')
        .values('order_number', 'status', 'payment_status', 'total_amount', 'created_at', 'updated_at')[:50]
    )

    return Response({
        'period': period,
        'basis': 'updated_at',
        'total_revenue': total_revenue,
        'total_orders': total_orders,
        'start_date': start_date,
        'series': series,
        'debug': {'counts': debug_counts, 'sample': sample},
    })