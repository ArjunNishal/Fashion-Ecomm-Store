export const sidebarlinks = [
  {
    id: 1,
    url: "/panel_dashboard",
    name: "Dashboard",
    icon: "fas fa-home",
    permission: [""],
    activePageurls: ["panel_dashboard"],
  },
  {
    id: 2,
    url: "/panel_admins",
    name: "Admins",
    icon: "fas fa-users-crown",
    permission: [""],
    activePageurls: ["panel_admins"],
  },
  {
    id: 3,
    url: "/panel_users",
    name: "Users",
    icon: "fas fa-users",
    permission: ["Manage Users"],
    activePageurls: ["panel_users"],
  },
  {
    id: 4,
    url: "/panel_categories",
    name: "Categories",
    icon: "fas fa-cubes",
    permission: ["Manage Categories"],
    activePageurls: [
      "panel_categories",
      "panel_featurecat",
      "panel_featurecatproducts",
    ],
  },
  {
    id: 5,
    url: "/panel_products",
    name: "Products",
    icon: "fas fa-tshirt",
    permission: ["Manage Products"],
    activePageurls: [
      "panel_products",
      "panel_product",
      "panel_createproduct",
      "panel_editproduct",
      "panel_catproduct",
      "panel_featureproducts",
    ],
  },
  {
    id: 6,
    url: "/panel_orders",
    name: "Orders",
    icon: "fas fa-truck",
    permission: ["Manage Orders"],
    activePageurls: ["panel_orders", "panel_order"],
  },
  {
    id: 7,
    url: "/panel_queryList",
    name: "Queries",
    icon: "fas fa-question-circle",
    permission: ["Query"],
    activePageurls: ["panel_queryList"],
  },
  {
    id: 8,
    url: "/panel_newsletter",
    name: "Newsletter",
    icon: "fas fa-envelope-open-text",
    permission: ["Manage Newsletter"],
    activePageurls: [
      "panel_newsletter",
      "panel_createnewsletter",
      "panel_subscribers",
    ],
  },
  {
    id: 9,
    url: "/panel_offersandcoupons",
    name: "Offers & Coupons",
    icon: "fas fa-bullhorn",
    permission: ["Manage Offers and Coupons"],
    activePageurls: ["panel_offersandcoupons"],
  },
  {
    id: 10,
    url: "/panel_contactList",
    name: "Contact Us Forms",
    icon: "fas fa-user-headset",
    permission: ["Contact Us Forms"],
    activePageurls: ["panel_contactList"],
  },
];

export const adminpermissions = [
  "Manage Categories",
  "Manage Users",
  "Manage Products",
  "Edit Products",
  "Query",
  "Contact Us Forms",
  "Add Product",
  "Add Category",
  "Manage Orders",
  "Manage Newsletter",
  "Add Newsletter",
  "Manage Offers and Coupons",
  "Add Offer",
  "Edit Offer",
  "Add Coupon",
  "Edit Coupon",
];

// close modals functions
export function closecreateAdminmodal() {
  const myButton = document.getElementById("CreateAdminModalClosebtn");
  myButton.click();
}
export function closeeditAdminmodal() {
  const myButton = document.getElementById("EditAdminModalClosebtn");
  myButton.click();
}

export function closeeditCategorymodal() {
  const myButton = document.getElementById("EditCategoryModalClosebtn");
  myButton.click();
}

export function closecreateCategorymodal() {
  const myButton = document.getElementById("CreateCategoryModalClosebtn");
  myButton.click();
}

export function closeoffermodal() {
  const myButton = document.getElementById("closeoffermodalbtn");
  myButton.click();
}

export function closecouponmodal() {
  const myButton = document.getElementById("closecouponmodalbtn");
  myButton.click();
}
