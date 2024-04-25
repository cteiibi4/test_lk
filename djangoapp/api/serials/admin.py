from django.contrib import admin
from .models import Serials, SerialShopCashier, Clients, Shops, Features, FeatureSerial

# Register your models here.
admin.site.register(Serials)
admin.site.register(SerialShopCashier)
admin.site.register(Clients)
admin.site.register(Shops)
admin.site.register(Features)
admin.site.register(FeatureSerial)