# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from datetime import datetime, timedelta


class Clients(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True, auto_now_add=True)
    updated_at = models.DateTimeField(blank=True, null=True, auto_now=True)
    brand_name = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'api"."clients'


class FailedJobs(models.Model):
    id = models.BigAutoField(primary_key=True)
    uuid = models.CharField(unique=True, max_length=255)
    connection = models.TextField()
    queue = models.TextField()
    payload = models.TextField()
    exception = models.TextField()
    failed_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'api"."failed_jobs'


class FeatureSerial(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True, auto_now_add=True)
    updated_at = models.DateTimeField(blank=True, null=True, auto_now=True)
    feature_id = models.BigIntegerField()
    serial_id = models.BigIntegerField()
    value = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'api"."feature_serial'


class Features(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True, auto_now_add=True)
    updated_at = models.DateTimeField(blank=True, null=True, auto_now=True)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=255)
    default_value = models.CharField(max_length=255)
    options = models.CharField(max_length=255, blank=True, null=True)
    default_enabled = models.BooleanField()
    description = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'api"."features'


class Migrations(models.Model):
    migration = models.CharField(max_length=255)
    batch = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'api"."migrations'


class PasswordResetTokens(models.Model):
    email = models.CharField(primary_key=True, max_length=255)
    token = models.CharField(max_length=255)
    created_at = models.DateTimeField(blank=True, null=True, auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'api"."password_reset_tokens'


class PersonalAccessTokens(models.Model):
    id = models.BigAutoField(primary_key=True)
    tokenable_type = models.CharField(max_length=255)
    tokenable_id = models.BigIntegerField()
    name = models.CharField(max_length=255)
    token = models.CharField(unique=True, max_length=64)
    abilities = models.TextField(blank=True, null=True)
    last_used_at = models.DateTimeField(blank=True, null=True)
    expires_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True, auto_now_add=True)
    updated_at = models.DateTimeField(blank=True, null=True, auto_now=True)

    class Meta:
        managed = False
        db_table = 'api"."personal_access_tokens'


class Receipts(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True, auto_now_add=True)
    updated_at = models.DateTimeField(blank=True, null=True, auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    data = models.JSONField(blank=True, null=True)
    shop_code = models.IntegerField()
    cashier_number = models.IntegerField()
    closed_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'api"."receipts'


class SerialShopCashier(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True, auto_now_add=True)
    updated_at = models.DateTimeField(blank=True, null=True, auto_now=True)
    serial = models.ForeignKey('Serials', models.DO_NOTHING)
    shop = models.ForeignKey('Shops', models.DO_NOTHING)
    cashier_number = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'api"."serial_shop_cashier'


class Serials(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True, auto_now_add=True)
    updated_at = models.DateTimeField(blank=True, null=True, auto_now=True)
    serial = models.BigIntegerField(unique=True)
    client = models.ForeignKey(Clients, models.DO_NOTHING, blank=True, null=True)
    shop = models.ForeignKey('Shops', models.DO_NOTHING, blank=True, null=True)
    mac = models.CharField(unique=True, max_length=255)
    cpu_name = models.CharField(max_length=255, blank=True, null=True)
    os = models.CharField(max_length=255, blank=True, null=True)
    usb_devices = models.TextField(blank=True, null=True)  # This field type is a guess.
    screen_resolution = models.CharField(max_length=255, blank=True, null=True)
    ip = models.CharField(max_length=255, blank=True, null=True)
    hostname = models.CharField(max_length=255, blank=True, null=True)
    accept_serial = models.BooleanField()
    last_ping = models.DateTimeField(blank=True, null=True)

    @property
    def active(self):
        check_time = datetime.now() - timedelta(minutes=15)
        if self.last_ping and self.last_ping > check_time:
            return True
        return False

    @property
    def features(self):
        features = Features.objects.all()
        features_serial = FeatureSerial.objects.filter(serial_id=self.id)
        features_dict = dict()
        for feature in features:
            f = {
                "feature_id": feature.id,
                "name": feature.name,
                "type": feature.type,
                "description": feature.description,
                "value": feature.default_value
            }
            features_dict[feature.id] = f
        for feature in features_serial:
            f = features_dict[feature.feature_id]
            f["value"] = feature.value if feature.value else f["value"]
            f["id"] = feature.id if feature.id else -1
        return list(features_dict.values())

    @property
    def cashier_number(self):
        cashier = SerialShopCashier.objects.get(shop=self.shop, serial=self)
        return cashier.cashier_number



    class Meta:
        managed = False
        db_table = 'api"."serials'


class Shops(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True, auto_now_add=True)
    updated_at = models.DateTimeField(blank=True, null=True, auto_now=True)
    shop_code = models.BigIntegerField()
    client = models.ForeignKey(Clients, models.DO_NOTHING, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    accept_serial = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'api"."shops'


class Terminals(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(blank=True, null=True, auto_now_add=True)
    updated_at = models.DateTimeField(blank=True, null=True, auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    shop_code = models.CharField(unique=True, max_length=10)
    sbp = models.CharField(max_length=14)
    sberpay = models.CharField(max_length=14)
    terminal = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'api"."terminals'


class Users(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.CharField(unique=True, max_length=255)
    email_verified_at = models.DateTimeField(blank=True, null=True)
    password = models.CharField(max_length=255)
    remember_token = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True, auto_now_add=True)
    updated_at = models.DateTimeField(blank=True, null=True, auto_now=True)

    class Meta:
        managed = False
        db_table = 'api"."users'
