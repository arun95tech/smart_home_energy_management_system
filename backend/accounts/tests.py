# Access control tests
from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import UserProfile
from accounts.utils import create_auth_token, get_request_user
from appliances.models import Appliance, ApplianceSchedule, FaultReport
# AccessControlRegressionTests section


class AccessControlRegressionTests(TestCase):
    # setUp function
    def setUp(self):
        self.client = APIClient()
        self.homeowner = User.objects.create_user(username='homeowner', password='oldpass123')
        self.other_homeowner = User.objects.create_user(username='other', password='oldpass123')
        self.admin = User.objects.create_user(username='admin', password='adminpass123')
        self.technician = User.objects.create_user(username='tech', password='techpass123')

        UserProfile.objects.create(user=self.homeowner, role='homeowner', is_active_member=True)
        UserProfile.objects.create(user=self.other_homeowner, role='homeowner', is_active_member=True)
        UserProfile.objects.create(user=self.admin, role='admin', is_active_member=True)
        UserProfile.objects.create(user=self.technician, role='technician', is_active_member=True)

        self.appliance = Appliance.objects.create(
            homeowner=self.homeowner,
            name='Kettle',
            appliance_type='other',
            power_rating=1200,
        )
        self.other_appliance = Appliance.objects.create(
            homeowner=self.other_homeowner,
            name='Heater',
            appliance_type='heater',
            power_rating=2000,
        )
    # auth function

    def auth(self, user):
        return {'HTTP_AUTHORIZATION': f'Bearer {create_auth_token(user)}'}
    # test_spoofed_identity_headers_do_not_authenticate function

    def test_spoofed_identity_headers_do_not_authenticate(self):
        request = APIClient().get(
            '/api/user-profiles/',
            HTTP_X_USER_ID=str(self.admin.id),
            HTTP_X_ROLE='admin',
        ).wsgi_request

        self.assertFalse(get_request_user(request).is_authenticated)
    # test_login_returns_signed_auth_token function

    def test_login_returns_signed_auth_token(self):
        response = self.client.post(
            '/api/login/',
            {'username': 'homeowner', 'password': 'oldpass123', 'role': 'homeowner'},
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn('auth_token', response.data)
    # test_password_change_requires_current_password function

    def test_password_change_requires_current_password(self):
        response = self.client.post(
            '/api/change-password/',
            {'new_password': 'newpass123'},
            format='json',
            **self.auth(self.homeowner),
        )

        self.assertEqual(response.status_code, 400)
    # test_homeowner_sees_only_own_appliances function

    def test_homeowner_sees_only_own_appliances(self):
        response = self.client.get('/api/appliances/', **self.auth(self.homeowner))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.appliance.id)
    # test_homeowner_cannot_schedule_another_homeowners_appliance function

    def test_homeowner_cannot_schedule_another_homeowners_appliance(self):
        response = self.client.post(
            '/api/appliance-schedules/',
            {'appliance': self.other_appliance.id, 'start_time': '10:00', 'end_time': '11:00'},
            format='json',
            **self.auth(self.homeowner),
        )

        self.assertEqual(response.status_code, 403)
    # test_fault_reports_are_filtered_by_homeowner function

    def test_fault_reports_are_filtered_by_homeowner(self):
        own_fault = FaultReport.objects.create(
            appliance=self.appliance,
            homeowner=self.homeowner,
            message='Own fault',
        )
        FaultReport.objects.create(
            appliance=self.other_appliance,
            homeowner=self.other_homeowner,
            message='Other fault',
        )

        response = self.client.get('/api/fault-reports/', **self.auth(self.homeowner))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], own_fault.id)
    # test_admin_can_read_all_appliance_schedules function

    def test_admin_can_read_all_appliance_schedules(self):
        ApplianceSchedule.objects.create(
            appliance=self.appliance,
            start_time='10:00',
            end_time='11:00',
        )

        response = self.client.get('/api/appliance-schedules/', **self.auth(self.admin))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
