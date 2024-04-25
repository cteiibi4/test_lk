import json
import logging
import datetime
from rest_framework.views import APIView
from rest_framework import permissions, viewsets, status
from rest_framework.response import Response
from .models import Serials, Shops, FeatureSerial, Features, SerialShopCashier
from .serializers import SerialsSerializer, SerialSerializer, ShopSerializer, FeatureSetSerializer, ChangeShopSerializer, SerialShopCashierSerializer
from django.db.models import Q

logger = logging.getLogger(__name__)


class SerialsViewSet(viewsets.ModelViewSet):
    queryset = Serials.objects.all()
    serializer_class = SerialsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        sort_field = self.request.query_params.get('sort', 'serial')
        direction = self.request.query_params.get('sort_direction', 'false')
        filter = self.request.query_params.get('filter', None)
        filter_field = self.request.query_params.get('filter_field', None)
        if sort_field in Serials.__dict__:
            ordering = sort_field
        else:
            ordering = "shop__" + sort_field
        if direction == 'false':
            ordering = '-' + ordering
        if filter and filter_field:
            if filter_field != "serial":
                field = "shop__" + filter_field
            else:
                field = filter_field
            filter_dict = {field: filter}
            answer = Serials.objects.filter(**filter_dict).order_by(ordering)
        else:
            answer = Serials.objects.order_by(ordering)
        return answer


class SerialViewSet(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serial_no = self.request.query_params.get("serial_no", None)
        serial = Serials.objects.get(serial = serial_no)
        serialiezer = SerialSerializer(serial)
        return Response(serialiezer.data)

    def post(self, request, *args, **kwargs):
        serializer = ChangeShopSerializer(data=self.request.data)
        if serializer.is_valid():
            serial_id = self.request.data.get("id")
            shop_id = self.request.data.get("shop_id")
            serial = Serials.objects.get(id = serial_id)
            accept_serial = self.request.data.get("accept_serial")
            if shop_id:
                shop = Shops.objects.get(id = shop_id)
                serial.shop = shop
            if accept_serial:
                serial.accept_serial = accept_serial
            serial.usb_devices = json.dumps(serial.usb_devices)
            serial.updated_at = datetime.datetime.now()
            serial.save()
            serialiezer = SerialSerializer(serial)
            return Response(serialiezer.data)
        else:
            return Response(serializer.errors)


class ShopsViewSet(viewsets.ModelViewSet):
    queryset = Shops.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ShopSerializer

    def get_queryset(self):
        filter_value = self.request.query_params.get('filter', None)
        try:
            filter_value = int(filter_value)
        except:
            pass
        if filter_value and type(filter_value) == int:
            answer = Shops.objects.filter(Q(shop_code__contains=filter_value) | Q(address__contains=filter_value)).order_by('shop_code')
        elif filter_value:
            answer = Shops.objects.filter(address__contains = filter_value).order_by('shop_code')
        else:
            answer = Shops.objects.all().order_by('shop_code')
        return answer


class FeatureSerialViewSet(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = FeatureSetSerializer(data=self.request.data)
        if serializer.is_valid():
            features = self.request.data.get("features")
            serial_id = self.request.data.get("serial_id")
            for feature in features:
                f_s_id = feature.get("id")
                feature_id = feature.get("feature_id")
                value = feature.get("value")
                if f_s_id:
                    feature_s = FeatureSerial.objects.get(id = f_s_id)
                elif FeatureSerial.objects.filter(serial_id = serial_id, feature_id = feature_id).exists():
                    feature_s = FeatureSerial.objects.get(serial_id = serial_id, feature_id = feature_id)
                else:
                    feature_s = FeatureSerial(serial_id = serial_id, feature_id = feature_id)
                feature_s.value = value
                feature_s.save()
            serial = Serials.objects.get(id=serial_id)
            serializer = SerialSerializer(serial)
            return Response(serializer.data)
        else:
            return Response(serializer.errors)


class SerialShopCashierView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = SerialShopCashierSerializer(data = self.request.data)
        if serializer.is_valid():
            shop_id = self.request.data.get("shop_id")
            serial_id = self.request.data.get("serial_id")
            number = self.request.data.get("number")
            shop = Shops.objects.get(id=shop_id)
            serial = Serials.objects.get(id=serial_id)
            if SerialShopCashier.objects.filter(shop = shop, cashier_number = number).exists():
                return Response(status = status.HTTP_400_BAD_REQUEST)
            elif SerialShopCashier.objects.filter(shop = shop, serial = serial).exists():
                shop_cashier = SerialShopCashier.objects.get(shop = shop, serial = serial)
            else:
                shop_cashier = SerialShopCashier(shop = shop, serial = serial)
            shop_cashier.cashier_number = number
            shop_cashier.save()
            serial = Serials.objects.get(id=serial_id)
            serial_serializer = SerialSerializer(serial)
            return Response(serial_serializer.data)
        else:
            return Response(serializer.errors)


class SerialFromShopView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        shop_id = self.request.query_params.get("shop_id", None)
        shop = Shops.objects.get(id=shop_id)
        serials = Serials.objects.filter(shop = shop)
        serial_serializer = SerialsSerializer(serials, many=True)
        return Response(serial_serializer.data)