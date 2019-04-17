<?php
namespace Arsal\CheckoutSteps\Controller\Index;

use Magento\Sales\Api\OrderRepositoryInterface;
use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Checkout\Model\Session;
class Success extends Action
{

    /**
     * @var JsonFactory $resultJsonFactory
     */
    protected $resultJsonFactory;

    /**
     * @var Session $checkoutSession
     */
    private $checkoutSession;

    /**
     * @var OrderRepositoryInterface $orderRepository
     */
    private $orderRepository;

    /**
     * Success constructor.
     * @param Context $context
     * @param JsonFactory $resultJsonFactory
     * @param Session $session
     * @param OrderRepositoryInterface $orderRepository
     */
    public function __construct(
        Context $context,
        JsonFactory $resultJsonFactory,
        Session $session,
        OrderRepositoryInterface $orderRepository
    ) {
        parent::__construct($context);
        $this->resultJsonFactory = $resultJsonFactory;
        $this->checkoutSession = $session;
        $this->orderRepository = $orderRepository;
    }


    public function execute()
    {

        /** @var \Magento\Framework\Controller\Result\Json $resultJson */
        $resultJson = $this->resultJsonFactory->create();
        $orderId = $this->checkoutSession->getData('last_order_id');
        $response = [];
        if (!empty($orderId)) {
            $order = $this->orderRepository->get($orderId);
            $items = [];
            foreach ($order->getItems() as $item) {
                $items[] = $item->getData();
            }
            $response = [
                'orderId'       =>  $order->getIncrementId(),
                'orderItems'    =>  $items,
                'shippingAddress'   =>  $order->getShippingAddress()->getData(),
                'billingAddress'   =>  $order->getBillingAddress()->getData(),
                'grandTotal'        =>  $order->getBaseGrandTotal(),
                'shippingTotal'        =>  $order->getBaseShippingAmount(),
            ];
        }

        $resultJson->setData($response);
        return $resultJson;
    }
}
