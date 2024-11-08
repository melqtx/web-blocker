from selenium import webdriver
import unittest

class TestPopup(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome()

    def test_popup_functionality(self):
        self.driver.get('http://yourwebsite.com')
        # Add code to trigger the popup and verify its behavior

    def tearDown(self):
        self.driver.quit()

if __name__ == '__main__':
    unittest.main()