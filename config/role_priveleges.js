export const role_privileges = {
  privGroups: [
    {
      id: "USERS",
      name: "User Permissions",
    },
    {
      id: "EMPLOYEES",
      name: "Employes Permissions",
    },
    {
      id: "ROLES",
      name: "Role Permissions",
    },
    {
      id: "PAGES",
      name: "Page Permissions",
    },
    {
      id: "DEFINITIONS",
      name: "Definitions Permissions",
    },
    {
      id: "APPOINTMENTS",
      name: "Appointment Permissions",
    },
    {
      id: " PAYMENTS",
      name: "Payments Permissions",
    },
    {
      id: "STATICS",
      name: "Statics Permissions",
    },
    {
      id: "SETTINGS",
      name: "Settings Permissions",
    },
    {
      id: "AUDITLOGS",
      name: "AuditLogs Permissions",
    },
  ],
  privileges: [
    // {
    //   key: "appointment_page_view",  // code içinde kullanılacak
    //   name: "Randevu ekranını Görüntüleme", //arayüzde kullanılacak
    //   group: "PAGES",
    //   description: "appointment Page View", 
    // },
    {
      key: "user_view",  // code içinde kullanılacak
      name: "Hasta Görüntüleme", //arayüzde kullanılacak
      group: "USERS",
      description: "User View", 
    },
    {
      key: "user_add",
      name: "Hasta Ekleme",
      group: "USERS",
      description: "User Add",
    },
    {
      key: "user_update",
      name: "Hasta Güncelleme",
      group: "USERS",
      description: "User Update",
    },
    {
      key: "employee_view",
      name: "Personel Görüntüleme",
      group: "EMPLOYEES",
      description: "Employee View",
    },
    {
      key: "employee_add",
      name: "Personel Ekleme",
      group: "EMPLOYEES",
      description: "Employee Add",
    },
    {
      key: "employee_update",
      name: "Personel Düzenleme",
      group: "EMPLOYEES",
      description: "Employee Update",
    },
    {
      key: "appointment_get",
      name: "Randevu Alabilme",
      group: "APPOINTMENTS",
      description: "Appointment Getting",
    },
    {
      key: "appointment_view",
      name: "Randevu Görüntüleme",
      group: "APPOINTMENTS",
      description: "Appointment View",
    },
    {
      key: "appointment_add",
      name: "Randevu Ekleme",
      group: "APPOINTMENTS",
      description: "Appointment Add",
    },
    {
      key: "appointment_update",
      name: "Randevu Düzenleme",
      group: "APPOINTMENTS",
      description: "Appointment Update",
    },
    {
      key: "appointment_delete",
      name: "Randevu Silme",
      group: "APPOINTMENTS",
      description: "Appointment Delete",
    },
    {
      key: "payment_view",
      name: "Kasa Görüntüleme",
      group: "PAYMENTS",
      description: "Payments View",
    },
    {
      key: "payment_add",
      name: "Ödeme Ekleme",
      group: "PAYMENTS",
      description: "Payments Add",
    },
    {
      key: "payment_update",
      name: "Ödeme Düzenleme",
      group: "PAYMENTS",
      description: "Payments Update",
    },
    {
      key: "payment_delete",
      name: "Ödeme Silme",
      group: "PAYMENTS",
      description: "Payments Delete",
    },
    {
      key: "settings_view",
      name: "Ayarları Görüntüleme",
      group: "SETTINGS",
      description: "Settings View",
    },
    {
      key: "settings_update",
      name: "Ayarları Düzenleme",
      group: "SETTINGS",
      description: "Settings Update",
    },
    {
      key: "data_view",
      name: "Verileri Görüntüleme",
      group: "DATAS",
      description: "Datas View",
    },
    {
      key: "data_update",
      name: "Verileri Düzenleme",
      group: "DATAS",
      description: "Datas Update",
    },
    {
      key: "data_delete",
      name: "Verileri Silme",
      group: "DATAS",
      description: "Datas Delete",
    },
    {
      key: "data_add",
      name: "Verileri Ekleme",
      group: "DATAS",
      description: "Datas Add",
    },
    {
      key: "option_add",
      name: "Opsiyon Ekleme",
      group: "OPTIONS",
      description: "Options Add",
    },
    {
      key: "service_view",
      name: "Hizmet Görüntüleme",
      group: "SERVICES",
      description: "Service View",
    },
    {
      key: "service_add",
      name: "Hizmet Ekleme",
      group: "SERVICES",
      description: "Service Add",
    },
    {
      key: "service_update",
      name: "Hizmet Düzenleme",
      group: "SERVICES",
      description: "Service Update",
    },
    {
      key: "product_view",
      name: "Ürün Görüntüleme",
      group: "PRODUCTS",
      description: "Product View",
    },
    {
      key: "product_edit",
      name: "Ürün Düzenleme",
      group: "PRODUCTS",
      description: "Product Edit",
    },
    {
      key: "product_add",
      name: "Ürün Ekleme",
      group: "PRODUCTS",
      description: "Product Add",
    },
    {
      key: "product_update",
      name: "Ürün Düzenleme",
      group: "PRODUCTS",
      description: "Product Update",
    },
    {
      key: "statics_view",
      name: "İstatistik Görüntüleme",
      group: "STATICS",
      description: "Statics View",
    },
    {
      key: "reports_view",
      name: "Rapor Görüntüleme",
      group: "REPORTS",
      description: "Reports View",
    },
    {
      key: "sms_view",
      name: "Sms Görüntüleme",
      group: "SMS",
      description: "Sms View",
    },
    {
      key: "sms_update",
      name: "Sms Düzenleme",
      group: "SMS",
      description: "Sms Update",
    },
    {
      key: "sms_add",
      name: "Sms Şablon Ekleme",
      group: "SMS",
      description: "Sms Add",
    },
    {
      key: "sms_single_send",
      name: "Tekil Sms Gaönderme",
      group: "SMS",
      description: "Sms Send",
    },
    {
      key: "sms_bulk_send",
      name: "Toplu Sms Gaönderme",
      group: "SMS",
      description: "Sms Send Bulk",
    },
    {
      key: "sms_single_send",
      name: "Tekil Sms Gaönderme",
      group: "SMS",
      description: "Sms Send Single",
    },
  ],
};


