class AppDashboardModel {
  //   constructor() {
  //     this.id = id;
  //     this.customer_id = customer_id;
  //     this.order_number = order_number;
  //   }

  setLocations(locations) {
    this.locations = locations;
  }

  setProducts(products) {
    this.products = products;
  }

  setCoupons(coupons) {
    this.coupons = coupons;
  }

  setServiceAreas(serviceArea) {
    this.serviceArea = serviceArea;
  }
  setAbout(about) {
    this.about = about;
  }
  setTnc(tnc) {
    this.tnc = tnc;
  }

  getLocations() {
    return this.locations;
  }

  getProducts() {
    return this.products;
  }

  getCoupons() {
    return this.coupons;
  }

  getServiceAreas() {
    return this.serviceArea;
  }
  getAbout() {
    return this.about;
  }
  getTnc() {
    return this.tnc;
  }
}

const GlobalAppDashboardModel = new AppDashboardModel();
export default GlobalAppDashboardModel;
