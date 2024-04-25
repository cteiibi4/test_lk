from django.conf import settings
from rest_framework import pagination
from rest_framework.response import Response


class MyPagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    page_query_param = 'page'

    def get_paginated_response(self, data):
        return Response({
            'links': {
               'next': self.get_next_link(),
               'previous': self.get_previous_link()
            },
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'showing_pages': self.showing_pages,
            'filter_fields': self.filter_fields,
            'results': data
        })
    
    @property
    def showing_pages(self):
        showing_pages = []
        all_pages = self.page.paginator.num_pages
        current_page = self.page.number
        if all_pages <= 5:
            showing_pages = [i for i in range(1, all_pages+1)]
        elif current_page <= 3:
            showing_pages = [i for i in range(1, 5)]
        elif current_page >= all_pages - 3:
            showing_pages = [i for i in range(all_pages - 5, all_pages + 1)]
        else:
            showing_pages = [i for i in range(current_page-3, current_page +3)]
        return showing_pages

    @property
    def filter_fields(self):
        return {'serial': "Серийный номер", "shop_code": "Номер магазина", "address": "Адресс"}
