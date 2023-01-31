class OrderModel {
  //   constructor() {
  //     this.id = id;
  //     this.customer_id = customer_id;
  //     this.order_number = order_number;
  //   }

  setBillingAddress(billingAddress) {
    this.billingAddress = billingAddress;
  }

  setShippingAddress(shippingAddress) {
    this.shippingAddress = shippingAddress;
  }

  setLineItems(lineItems) {
    this.lineItems = lineItems;
  }

  setOrderMetadata(orderMetadata) {
    this.orderMetadata = orderMetadata;
  }

  setPaymentDetails(paymentDetails) {
    this.paymentDetails = paymentDetails;
  }

  getOrder() {
    const order = {
      order: {
        id: this.id,
        customer_id: this.customer_id,
        order_number: this.order_number,
        billing_address: this.billingAddress,
        shipping_address: this.shippingAddress,
        line_items: this.lineItems,
        order_meta: this.orderMetadata,
        payment_details: this.paymentDetails,
      },
    };
    return order;
  }
}

// class BillingAddress {
//   constructor() {
//     stateName, username, email, mobile, gender, address;
//   }
// }
const GlobalOrderModel = new OrderModel();
export default GlobalOrderModel;
