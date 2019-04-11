define(
    [
        'jquery',
        'ko',
        'uiComponent',
        'underscore',
        'Magento_Checkout/js/model/step-navigator',
        'Magento_Customer/js/model/customer',
        'mage/translate'
    ],
    function (
        $,
        ko,
        Component,
        _,
        stepNavigator,
        customer,
        $t
    ) {
        'use strict';

        return Component.extend({
            defaults: {
                template: 'Arsal_CheckoutSteps/customerstep'
            },

            isVisible: ko.observable(false),
            customerTitle: 'Customer Login',

            /**
             *
             * @returns {*}
             */
            initialize: function () {
                this._super();



                if (!customer.isLoggedIn()) {
                    this.isVisible(true);
                    stepNavigator.registerStep(
                        'customer-step',
                        null,
                        $t('Customer'),
                        this.isVisible,
                        _.bind(this.navigate, this),
                        8
                    );
                } else {
                    this.isVisible(false);
                }

                return this;
            },


            navigate: function() {},

            /**
             * @returns void
             */
            navigateToNextStep: function () {
                if (!customer.isLoggedIn()) {
                    stepNavigator.next();
                }
            }
        });
    }
);
