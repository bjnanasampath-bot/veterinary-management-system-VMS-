from rest_framework import serializers
from .models import Bill, BillItem


class BillItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillItem
        fields = '__all__'
        read_only_fields = ['bill', 'total_price']


class BillSerializer(serializers.ModelSerializer):
    items = BillItemSerializer(many=True, required=False)
    pet_name = serializers.CharField(source='pet.name', read_only=True)
    owner_name = serializers.CharField(source='pet.owner.full_name', read_only=True)

    class Meta:
        model = Bill
        fields = '__all__'
        read_only_fields = ['bill_number', 'due_amount']

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        bill = Bill.objects.create(**validated_data)
        for item_data in items_data:
            BillItem.objects.create(bill=bill, **item_data)
        # Calculate totals
        subtotal = sum(item.total_price for item in bill.items.all())
        bill.subtotal = subtotal
        discount = subtotal * (bill.discount_percent / 100)
        bill.discount_amount = discount
        taxable = subtotal - discount
        bill.tax_amount = taxable * (bill.tax_percent / 100)
        bill.total_amount = taxable + bill.tax_amount
        bill.due_amount = bill.total_amount - bill.paid_amount
        bill.save()
        return bill


class BillListSerializer(serializers.ModelSerializer):
    pet_name = serializers.CharField(source='pet.name', read_only=True)
    owner_name = serializers.CharField(source='pet.owner.full_name', read_only=True)

    class Meta:
        model = Bill
        fields = ['id', 'bill_number', 'pet_name', 'owner_name', 'total_amount', 'paid_amount', 'due_amount', 'status', 'payment_method', 'created_at']
