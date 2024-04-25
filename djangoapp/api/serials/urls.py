from django.urls import path, include
from rest_framework import routers
from .views import SerialFromShopView, SerialsViewSet, SerialViewSet, ShopsViewSet, FeatureSerialViewSet, SerialShopCashierView

app_name = "serials"

router = routers.DefaultRouter()
router.register(r'serials', SerialsViewSet, basename='Serials')
router.register(r'shops', ShopsViewSet, basename='Serial')

urlpatterns = [
    path("", include(router.urls), name="serials"),
    path("serial/", SerialViewSet.as_view(), name="serial"),
    path("feature/", FeatureSerialViewSet.as_view(), name="feature"),
    path("change_cash_number/", SerialShopCashierView.as_view(), name="change_cash_number"),
    path("serial_from_shop/", SerialFromShopView.as_view(), name="serial_from_shop"),
    path('api-serials/', include('rest_framework.urls', namespace='rest_framework')),
]

urlpatterns += router.urls