require 'test_helper'

class MainPageControllerTest < ActionDispatch::IntegrationTest
  test "should get page" do
    get main_page_page_url
    assert_response :success
  end

end
