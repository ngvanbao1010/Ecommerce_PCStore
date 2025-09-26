from django.contrib import admin
from .models import *

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(User)
admin.site.register(Order)
admin.site.register(OrderDetail)
admin.site.register(Payment)
admin.site.register(Review)
admin.site.register(Cart)
admin.site.register(Comment)
admin.site.register(PCConfiguration)

