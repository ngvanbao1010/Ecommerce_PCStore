from django.urls import path, include
from . import views

urlpatterns = [

    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/profile/', views.profile, name='profile'),
    path('auth/profile/update/', views.update_profile, name='update_profile'),
    path('categories/', views.CategoryListCreateView.as_view(), name='category_list_create'),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='category_detail'),
    path('products/', views.ProductListView.as_view(), name='product_list'),
    path('products/<int:pk>/', views.ProductDetailView.as_view(), name='product_detail'),
    path('products/create/', views.ProductCreateView.as_view(), name='product_create'),
    path('products/<int:pk>/manage/', views.ProductUpdateDeleteView.as_view(), name='product_manage'),
    path('products/compare/', views.compare_products, name='compare_products'),
    path('cart/', views.CartListView.as_view(), name='cart_list'),
    path('cart/add/', views.add_to_cart, name='add_to_cart'),
    path('cart/<int:pk>/update/', views.update_cart_item, name='update_cart_item'),
    path('cart/<int:pk>/remove/', views.remove_from_cart, name='remove_from_cart'),
    path('orders/', views.OrderListView.as_view(), name='order_list'),
    path('orders/<int:pk>/', views.OrderDetailView.as_view(), name='order_detail'),
    path('orders/create/', views.create_order, name='create_order'),
    path('orders/<int:pk>/update-status/', views.update_order_status, name='update_order_status'),
    path('orders/<int:pk>/update-payment/', views.update_payment_status, name='update_payment_status'),
    path('orders/<int:pk>/cancel/', views.cancel_order, name='cancel_order'),
    path('reviews/', views.ReviewListCreateView.as_view(), name='review_list_create'),
    path('comments/', views.CommentListCreateView.as_view(), name='comment_list_create'),
    path('pc-configs/', views.PCConfigurationListCreateView.as_view(), name='pc_config_list_create'),
    path('pc-configs/<int:pk>/', views.PCConfigurationDetailView.as_view(), name='pc_config_detail'),
    path('statistics/sales/', views.sales_statistics, name='sales_statistics'),
]
