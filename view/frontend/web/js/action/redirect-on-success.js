define(
    [
        'Magento_Checkout/js/model/step-navigator'
    ],
    function (stepNavigator) {
        'use strict';

        return {
            execute: function () {
                stepNavigator.next();
            }
        }
    }
);
