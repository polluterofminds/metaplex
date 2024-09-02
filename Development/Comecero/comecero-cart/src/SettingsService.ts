// SettingsService.js

const SettingsService = {
  get: () => {
    // If settings are not defined, use the default settings from the provided JS file
    //  @ts-ignore
    if (!window.__settings) {
      //  @ts-ignore
      window.__settings = {
        app: {
          "account_id": "BQ3422",
          "test": true,
          "company_name": "Mind Pollution, LLC.",
          "use_square_images": true,
          "form_label_position": "top",
          "footer_text": null,
          "error_notifications": "moderate",
          "show_promo_code": true,
          "promo_code_name": "Promo Code",
          "hide_quantity": false,
          "exp_select": false,
          "ask_save_cards": false,
          "show_digital_delivery": true,
          "enable_languages": true,
          "show_continue_shopping": true,
          "upsell_prompt": "order_submission",
          "cross_sell_position": "inline_top",
          "cross_sell_heading": "you_might_also_be_interested_in",
          "cross_sell_items": "1",
          "receipt_button_position": "end",
          "receipt_button_text": "continue_shopping",
          "receipt_button_text_custom": null,
          "receipt_button_url": "https://example.com?order_id={{order.order_id}}&payment_id={{payment.payment_id}}",
          "main_shopping_url": null,
          "not_found_url": "https://example.com/404",
          "fields": null
        },
        account: {
          "development": true,
          "api_host": "api.comecero.com",
          "account_id": "BQ3422",
          "test": true,
          "allow_save_cards": true,
          "global_footer_html": null,
          "currencies": [{ "code": "AUD", "name": "Australian Dollar" }, { "code": "CAD", "name": "Canadian Dollar" }, { "code": "EUR", "name": "Euro" }, { "code": "NZD", "name": "New Zealand Dollar" }, { "code": "GBP", "name": "Pound Sterling" }, { "code": "CHF", "name": "Swiss Franc" }, { "code": "USD", "name": "US Dollar" }],
          "payment_method_types": ["amazon_pay", "credit_card", "paypal", "apple_pay"],
          "allow_customer_subscription_cancel": true,
          "company_name": "Mind Pollution, LLC",
          "support_website": "https://polluterofminds.com",
          "support_email": "joe@example.com",
          "date_utc": "2024-08-26T00:00:00Z",
          "browser_info": {
            "accept_language": "en-US,en;q=0.9",
            "locale": "en-US",
            "language": "en",
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36"
          }
        }
      };
    }
    //  @ts-ignore
    return window.__settings;
  },
};

export default SettingsService;
