from rest_framework import serializers
from .models import Serials, Shops, FeatureSerial

class ShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shops
        fields = ['address', "shop_code", "id"]

class SerialsSerializer(serializers.ModelSerializer):
    shop = ShopSerializer(many = False, read_only = True)
    class Meta:
        model = Serials
        fields = ["shop", 'id', 'serial', 'client', 'mac', 'cpu_name', 'os', 'screen_resolution', 'ip', 'hostname', 'last_ping', 'active']


class SerialSerializer(serializers.ModelSerializer):
    shop = ShopSerializer(many = False, read_only = True)
    class Meta:
        model = Serials
        fields = ["shop", 'id', 'serial', 'client', 'mac', 'cpu_name', 'os', 'screen_resolution', 'ip', 'hostname', 'last_ping', 'active', "features", "accept_serial", "cashier_number"]


class ChangeShopSerializer(serializers.Serializer):
    id = serializers.IntegerField(required = True)
    shop_id = serializers.IntegerField(required = False)
    serial = serializers.IntegerField(required = False)
    accept_serial = serializers.BooleanField(required = False)


class FeatureSerialSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeatureSerial
        fields = ["id", "serial_id", "feature_id", "value"]


class FeatureSetSerializer(serializers.Serializer):
    features = FeatureSerialSerializer(many = True, read_only = True)
    serial_id = serializers.IntegerField(required = False)

    class Meta:
        fields = ["serial_id", "features"]


class SerialShopCashierSerializer(serializers.Serializer):
    shop_id = serializers.IntegerField(required = True)
    serial_id = serializers.IntegerField(required = True)
    number = serializers.IntegerField(required = True)
