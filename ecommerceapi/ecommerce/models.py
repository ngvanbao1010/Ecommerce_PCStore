from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
ROLE_CHOICES = [
    ('admin', 'Admin'),
    ('staff', 'Staff'),
    ('customer', 'Customer'),
]

ORDER_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('completed', 'Completed'),
    ('cancelled', 'Cancelled'),
]

PAYMENT_METHOD_CHOICES = [
    ('cod', 'Cash on Delivery'),
    ('paypal', 'PayPal'),
]

PAYMENT_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('completed', 'Completed'),
    ('cancelled', 'Cancelled'),
]

class User(AbstractUser):
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    full_name = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/%Y/%m/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.username

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'categories'
        verbose_name_plural = 'Categories'
    
    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    stock_quantity = models.IntegerField(default=0)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    brand = models.CharField(max_length=100, blank=True)
    specifications = models.JSONField(default=dict, blank=True)
    image = models.ImageField(upload_to='products/%Y/%m/', null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'products'
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['price']),
            models.Index(fields=['is_active']),
            models.Index(fields=['brand']),
        ]
    
    def __str__(self):
        return self.name
    
    @property
    def average_rating(self):
        reviews = self.reviews.all()
        if reviews:
            return sum([r.rating for r in reviews]) / len(reviews)
        return 0

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'carts'
        unique_together = ['user', 'product']
    
    def __str__(self):
        return f"{self.user.username} - {self.product.name} ({self.quantity})"
    
    @property
    def total_price(self):
        return self.product.price * self.quantity

class Order(models.Model):
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order_number = models.CharField(max_length=50, unique=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    shipping_address = models.TextField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'orders'
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['payment_status']),
            models.Index(fields=['user']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"Order {self.order_number}"
    
    def generate_order_number(self):
        import uuid
        return f"ORD-{uuid.uuid4().hex[:8].upper()}"
              
    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = self.generate_order_number()
        super().save(*args, **kwargs)

class OrderDetail(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='details')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    
    class Meta:
        db_table = 'order_details'
    
    def __str__(self):
        return f"{self.order.order_number} - {self.product.name}"
    
    def save(self, *args, **kwargs):
        self.total_price = self.unit_price * self.quantity
        super().save(*args, **kwargs)

class Payment(models.Model):
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    payment_gateway_transaction_id = models.CharField(max_length=255, blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default='VND')
    gateway_response = models.JSONField(default=dict, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'payments'
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['payment_gateway_transaction_id']),
        ]
    
    def __str__(self):
        return f"Payment {self.id} - {self.order.order_number}"

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'reviews'
        unique_together = ['user', 'product']
        indexes = [
            models.Index(fields=['rating']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.product.name} ({self.rating}⭐)"

class Comment(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    comment_text = models.TextField()
    is_staff_comment = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'comments'
        indexes = [
            models.Index(fields=['product', 'parent_comment']),
        ]
    
    def __str__(self):
        if self.parent_comment:
            return f"Reply to {self.parent_comment.user.username} by {self.user.username}"
        return f"Comment by {self.user.username} on {self.product.name}"
    
    def save(self, *args, **kwargs):
        if self.user.role in ['staff', 'admin']:
            self.is_staff_comment = True
        super().save(*args, **kwargs)

class PCConfiguration(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    components = models.JSONField()
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    is_compatible = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'pc_configurations'
    
    def __str__(self):
        return f"{self.user.username} - {self.name}"
    
    def _iter_components(self):
        if not isinstance(self.components, dict):
            return
        for key, val in self.components.items():
            product_id = None
            quantity = 1
            group = None

            if isinstance(key, int) or (isinstance(key, str) and key.isdigit()):
                try:
                    product_id = int(key)
                    quantity = int(val) if isinstance(val, int) or (isinstance(val, str) and str(val).isdigit()) else 1
                except Exception:
                    product_id, quantity = None, 1
            else:
                group = str(key).lower()
                if isinstance(val, dict):
                    pid = val.get('id') or val.get('product') or val.get('product_id')
                    if isinstance(pid, int) or (isinstance(pid, str) and str(pid).isdigit()):
                        product_id = int(pid)
                    qty = val.get('qty') or val.get('quantity') or 1
                    if isinstance(qty, int) or (isinstance(qty, str) and str(qty).isdigit()):
                        quantity = int(qty)
                elif isinstance(val, int) or (isinstance(val, str) and str(val).isdigit()):
                    product_id = int(val)

            if not product_id:
                continue
            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                continue
            yield product, max(1, quantity), group

    @staticmethod
    def _num_from_value(v):
        if v is None:
            return None
        if isinstance(v, (int, float)):
            return float(v)
        try:
            import re
            m = re.findall(r"[-+]?[0-9]*\.?[0-9]+", str(v))
            if not m:
                return None
            return float(m[0])
        except Exception:
            return None

    @staticmethod
    def _specs(product):
        if not product:
            return {}
        specs = getattr(product, 'specifications', {}) or {}
        if isinstance(specs, str):
            try:
                import json
                parsed = json.loads(specs)
                if isinstance(parsed, str):
                    try:
                        parsed = json.loads(parsed)
                    except Exception:
                        parsed = {}
                specs = parsed if isinstance(parsed, dict) else {}
            except Exception:
                specs = {}
        return specs if isinstance(specs, dict) else {}

    def _category_key(self, product):
        name = (product.category.name if product and product.category else '') or ''
        key = name.strip().lower()
        mapping = {
            'motherboard': 'mainboard', 'mainboard': 'mainboard', 'mb': 'mainboard', 'bo mach': 'mainboard', 'bo mạch': 'mainboard',
            'cpu': 'cpu', 'processor': 'cpu', 'cpu processor': 'cpu',
            'ram': 'ram', 'memory': 'ram', 'bộ nhớ': 'ram', 'bo nho': 'ram',
            'gpu': 'gpu', 'vga': 'gpu', 'graphics card': 'gpu', 'video card': 'gpu', 'card màn hình': 'gpu', 'card man hinh': 'gpu',
            'psu': 'psu', 'power supply': 'psu', 'power': 'psu', 'nguồn': 'psu', 'nguon': 'psu',
            'storage': 'storage', 'ssd': 'storage', 'hdd': 'storage', 'hard drive': 'storage', 'ổ cứng': 'storage', 'o cung': 'storage',
            'case': 'case', 'chassis': 'case', 'vỏ máy': 'case', 'vo may': 'case',
            'cooling': 'cooling', 'cooler': 'cooling', 'tản nhiệt': 'cooling', 'tan nhiet': 'cooling'
        }
        return mapping.get(key, key)

    def check_compatibility(self):
        cpu = mb = ram = gpu = psu = None
        cooling = kase = None
        reasons = []
        for product, qty, _group in self._iter_components():
            key = self._category_key(product)
            if key == 'cpu':
                cpu = product
            elif key == 'mainboard':
                mb = product
            elif key == 'ram':
                ram = product
            elif key == 'gpu':
                gpu = product
            elif key == 'psu':
                psu = product
            elif key == 'cooling':
                cooling = product
            elif key == 'case':
                kase = product

        spec = self._specs
        if cpu and mb:
            cpu_socket = spec(cpu).get('socket')
            mb_socket = spec(mb).get('socket')
            if cpu_socket and mb_socket and str(cpu_socket).strip().lower() != str(mb_socket).strip().lower():
                reasons.append(f"CPU socket {cpu_socket} != Mainboard socket {mb_socket}")
            elif not cpu_socket or not mb_socket:
                reasons.append("Missing socket info for CPU/Mainboard")

        if ram and mb:
            ram_type = spec(ram).get('type')
            mb_supported = spec(mb).get('supported_ram') or spec(mb).get('memory_type')
            if ram_type and mb_supported and str(ram_type).strip().lower() != str(mb_supported).strip().lower():
                reasons.append(f"RAM type {ram_type} not supported by Mainboard ({mb_supported})")
            elif not ram_type or not mb_supported:
                reasons.append("Missing RAM type or Mainboard supported RAM info")

        required_wattage = None
        psu_wattage = None
        if cpu or gpu:
            tdp_cpu = self._num_from_value(spec(cpu).get('tdp')) if cpu else 0
            tdp_gpu = self._num_from_value(spec(gpu).get('tdp')) if gpu else 0
            base = (tdp_cpu or 0) + (tdp_gpu or 0)
            if base:
                required_wattage = int(round(base * 1.2))
        if psu:
            specs = spec(psu)
            psu_wattage = self._num_from_value(specs.get('wattage') or specs.get('power') or specs.get('capacity') or specs.get('output'))
        if required_wattage is not None and psu_wattage is not None and psu_wattage < required_wattage:
            reasons.append(f"PSU wattage {int(psu_wattage)}W < required {required_wattage}W")

        if cooling and cpu:
            c_specs = spec(cooling)
            cpu_socket = spec(cpu).get('socket')
            sock_raw = c_specs.get('socket_support') or ''
            try:
                supported = [s.strip().lower() for s in str(sock_raw).replace(';', ',').replace('/', ',').split(',') if s.strip()]
            except Exception:
                supported = []
            if cpu_socket and supported and str(cpu_socket).strip().lower() not in supported:
                reasons.append(f"Cooling doesn't support CPU socket {cpu_socket}")
            c_max = self._num_from_value(c_specs.get('max_tdp'))
            tdp_cpu = self._num_from_value(spec(cpu).get('tdp'))
            if c_max is not None and tdp_cpu is not None and c_max < tdp_cpu:
                reasons.append(f"Cooling max TDP {int(c_max)}W < CPU TDP {int(tdp_cpu)}W")

        if kase and mb:
            case_form = spec(kase).get('form_factor')
            mb_form = spec(mb).get('form_factor')
            if case_form and mb_form and str(case_form).strip().lower() != str(mb_form).strip().lower():
                reasons.append(f"Case form {case_form} may not fit Mainboard {mb_form}")
        if kase and cooling:
            max_h = self._num_from_value(spec(kase).get('max_cooler_height'))
            c_h = self._num_from_value(spec(cooling).get('height'))
            if max_h is not None and c_h is not None and c_h > max_h:
                reasons.append(f"Cooler height {int(c_h)}mm > case limit {int(max_h)}mm")

        compatible = len(reasons) == 0
        return {
            'compatible': compatible,
            'reasons': reasons,
            'required_wattage': required_wattage,
            'psu_wattage': int(psu_wattage) if isinstance(psu_wattage, (int, float)) and psu_wattage is not None else psu_wattage,
        }

    def calculate_total_price(self):
        from decimal import Decimal
        total = Decimal('0')
        for product, quantity, _ in self._iter_components():
            total += (product.price or 0) * quantity
        return total
    
    def save(self, *args, **kwargs):
        if self.components:
            self.total_price = self.calculate_total_price()
            comp = self.check_compatibility()
            self.is_compatible = comp.get('compatible', True)
        super().save(*args, **kwargs)