define(
    [
        'jquery',
        'ko',
        'uiComponent',
        'underscore',
        'Magento_Checkout/js/model/step-navigator',
        'Magento_Checkout/js/model/quote',
        'Magento_Customer/js/model/customer',
        'mage/translate',
        'mage/url',
        'Magento_Checkout/js/model/full-screen-loader'
    ],
    function (
        $,
        ko,
        Component,
        _,
        stepNavigator,
        quote,
        customer,
        $t,
        url,
        fullScreenLoader
    ) {
        'use strict';

        return Component.extend({

            isVisible: ko.observable(true),
            title: 'Success Page',

            initialize: function (config) {
                this._super();

                stepNavigator.registerStep(
                    'success-step',
                    null,
                    $t('Success'),
                    this.isVisible,
                    _.bind(this.navigate, this),
                    22
                );

                if (config.title !== undefined) {
                    this.title = config.title;
                }

                return this;
            },

            navigate: function() {},

            /**
             * @returns void
             */
            navigateToNextStep: function () {
                fullScreenLoader.startLoader();
                window.location.replace(url.build(''));
            },

            getOrderText: function () {
                return 'Your order has been placed Successfully. Click Continue to proceed with shopping'
            },

            getOrderViewUrl: function () {
                return url.build('sales/order/history');
            }
        });
    }
);
