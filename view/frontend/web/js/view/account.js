define(
    [
        'jquery',
        'uiComponent',
        'ko',
        'Magento_Customer/js/model/customer',
        'Magento_Customer/js/action/login',
        'Magento_Checkout/js/model/quote',
        'Magento_Checkout/js/checkout-data',
        'Magento_Checkout/js/model/full-screen-loader',
        'mage/validation'
    ], function (
        $,
        Component,
        ko,
        customer,
        loginAction,
        quote,
        checkoutData,
        fullScreenLoader
    ) {
        'use strict';

        return Component.extend({
            defaults: {
                template: 'Arsal_CheckoutSteps/form/account',
                email: checkoutData.getInputFieldEmailValue(),
            },
            emailFocused: false,
            forgotPasswordUrl: window.checkoutConfig.forgotPasswordUrl,
            createNewAccountUrl: window.checkoutConfig.registerUrl,

            /**
             * Initializes observable properties of instance
             *
             * @returns {Object} Chainable.
             */
            initObservable: function () {
                this._super()
                    .observe(['email','emailFocused']);

                return this;
            },

            /**
             * Log in form submitting callback.
             *
             * @param {HTMLElement} loginForm - form element.
             */
            login: function (loginForm) {
                var loginData = {},
                    formDataArray = $(loginForm).serializeArray();

                formDataArray.forEach(function (entry) {
                    loginData[entry.name] = entry.value;
                });

                if ($(loginForm).validation() && $(loginForm).validation('isValid')) {
                    fullScreenLoader.startLoader();
                    loginAction(loginData, window.checkoutConfig.checkoutUrl).always(function () {
                        fullScreenLoader.stopLoader();
                    });
                }
            }
        });
    }
);
