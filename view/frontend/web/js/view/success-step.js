define(
    [
        'jquery',
        'ko',
        'uiComponent',
        'underscore',
        'Magento_Checkout/js/model/step-navigator',
        'Magento_Checkout/js/model/quote',
        'Magento_Catalog/js/price-utils',
        'Magento_Customer/js/model/customer',
        'mage/translate',
        'mage/url',
        'Magento_Checkout/js/model/full-screen-loader',
        'mage/storage'
    ],
    function (
        $,
        ko,
        Component,
        _,
        stepNavigator,
        quote,
        priceUtils,
        customer,
        $t,
        url,
        fullScreenLoader,
        storage
    ) {
        'use strict';

        return Component.extend({

            isVisible: ko.observable(false),
            order: ko.observable([]),
            displayOrderInfo: ko.observable(false),
            title: 'Success Page',
            orderId: ko.observable(),
            shippingAddress: ko.observable(false),

            initialize: function (config) {
                this._super();

                var self = this;

                this.isVisible.subscribe(function (value) {
                    if (value) {
                        fullScreenLoader.startLoader();
                        storage.post(
                            url.build('checkoutsteps/index/success'), JSON.stringify([])
                        ).always(
                            function (response) {
                                fullScreenLoader.stopLoader();
                                if (response && response.orderId !== undefined) {
                                    self.order(response);
                                    self.orderId(response.orderId);
                                    self.displayOrderInfo(true);
                                    var customerData = window.checkoutConfig.customerData;
                                    if (
                                        customerData !== undefined
                                        && customerData.addresses !== undefined
                                        && customerData.addresses[0] !== undefined
                                        && customerData.addresses[0].length
                                        && customerData.addresses[0].inline !== undefined
                                    )  {
                                        self.shippingAddress(customerData.addresses[0].inline);
                                    }
                                    else {
                                        self.__setAddress(response.shippingAddress, self);
                                    }

                                }
                            }
                        )
                    }
                });


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
                return 'Your order has been placed Successfully.'
            },

            getOrderViewUrl: function () {
                return url.build('sales/order/history');
            },

            getQuoteItems: function() {
                return window.checkoutConfig.quoteItemData;
            },

            getTotalsData: function() {
                return window.checkoutConfig.totalsData.total_segments;
            },

            getFormattedPrice: function (price) {
                return priceUtils.formatPrice(price, quote.getPriceFormat());
            },

            __setAddress: function ($addressObj, instance) {
                if (instance === undefined) {
                    instance = this;
                }
                var addressString = '';
                addressString += $addressObj.firstname + ' ' + $addressObj.lastname + ', ';
                addressString += $addressObj.street + ', ';
                if ($addressObj.city !== undefined) {
                    addressString = $addressObj.city + ', ';
                }

                if ($addressObj.region !== undefined) {
                    addressString += $addressObj.region + ' ';
                }
                if ($addressObj.postCode !== undefined) {
                    addressString += $addressObj.postCode + ' ';
                }
                addressString += $addressObj.country_id;

                if ($addressObj.address_type === 'shipping') {
                    instance.shippingAddress(addressString);
                }
            }
        });
    }
);
