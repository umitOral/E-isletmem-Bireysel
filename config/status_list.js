const APPOINTMENT_STATUS = {
  FINISH:"tamamlandı",
  COMPANYCANCEL:"İşletme iptali",
  USERCANCEL:"hasta iptali",
};
const APPOINTMENT_STATUS_AUTOMATIC= {
  WAITING: "aksiyon bekliyor",
};

const SESSION_STATUS_LIST = {
  INCOMPLETE: "yarım kaldı",
  USERCANCEL:"hasta iptali",
  COMPANYCANCEL:"işletme iptali",
  FINISH:"tamamlandı"
};
const SESSION_STATUS_LIST_AUTOMATIC = {
  WAITING:"aksiyon bekliyor",
  PLANNED:"planlandı"
};
const PAYMENT_STATUS = {
  PAID:"ödendi",
  NOTPAID:"ödenmedi"
};

const SERVICES_LIST = ["ayak bakımı", "tırnak bakımı", "peeling"];
const OPERATION_STATUS = {
  FINISH:"tamamlandı",
  USERCANCEL:"hasta iptali",
  COMPANYCANCEL:"İşletme iptali",
  
}
const OPERATION_STATUS_AUTOMATIC = {
  FINISH:"tamamlandı",
  CONTINUE:"devam ediyor",
  WAITING:"aksiyon bekliyor",
  PLANNED:"planlandı"
}
const OPERATION_APPOINTMENT_AVALIABLE_STATUS = {
  NO:"var",
  YES:"yok",
}

  

const ROLES_LIST = {
  ADMIN:"admin",
  MANAGER: "yönetici",
  EMPLOYEE: "personel",
  RECEPTION: "resepsiyon",
  FINANCE: "muhasebe",
};

const ORDER_STATUS_LIST = ["açık", "close", "cancel"];

export {
  APPOINTMENT_STATUS,
  APPOINTMENT_STATUS_AUTOMATIC,
  SERVICES_LIST,
  OPERATION_STATUS,
  ROLES_LIST,
  ORDER_STATUS_LIST,
  SESSION_STATUS_LIST,
  OPERATION_STATUS_AUTOMATIC,
  PAYMENT_STATUS,
  OPERATION_APPOINTMENT_AVALIABLE_STATUS,
  SESSION_STATUS_LIST_AUTOMATIC
};
