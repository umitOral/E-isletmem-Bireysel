const APPOINTMENT_STATUS = {
  FINISH: "tamamlandı",
  COMPANYCANCEL: "işletme iptali",
  USERCANCEL: "hasta iptali",
};
const APPOINTMENT_STATUS_AUTOMATIC = {
  WAITING: "aksiyon bekliyor",
};

const SESSION_STATUS_LIST = {
  INCOMPLETE: "yarım kaldı",
  USERCANCEL: "hasta iptali",
  COMPANYCANCEL: "işletme iptali",
  FINISH: "tamamlandı",
};
const SESSION_STATUS_LIST_AUTOMATIC = {
  WAITING: "aksiyon bekliyor",
  PLANNED: "planlandı",
};
const PAYMENT_STATUS = {
  PAID: "ödendi",
  NOTPAID: "ödenmedi",
};

const SERVICES_LIST = [
  "kaş alma",
  "microblading",
  "ayak bakımı",
  "tırnak bakımı",
  "peeling",
  "manikür",
  "pedikür",
  "kalıcı Makyaj",
  "kalıcı oje",
  "ipek kirpik",
  "cilt Bakımı",
  "lazer epilasyon",
  "kirpik Lifting",
  "protez Tırnak",
  "bölgesel İncelme",
  "yüz Bakımı",
  "cilt Gençleştirme",
  "masaj 1 saat",
];

const DATAS_LIST = [
  {
    dataName: "deri yağlanması",
    dataOptions: ["kuru", "karma", "normal"],
  },
  {
    dataName: "kıl yapısı",
    dataOptions: ["sert", "yumuşak", "normal"],
  },
  {
    dataName: "kıl kalınlığı",
    dataOptions: ["ince", "kalın", "normal"],
  },
  {
    dataName: "hastalıklar",
    dataOptions: ["diyabet", "tansiyon", "kalp"],
  },
  { dataName: "allerjiler", dataOptions: ["penisilin"] },
  {
    dataName: "folikül sayısı",
  },
];
const OPERATION_STATUS = {
  FINISH: "tamamlandı",
  USERCANCEL: "hasta iptali",
  COMPANYCANCEL: "İşletme iptali",
};
const OPERATION_STATUS_AUTOMATIC = {
  FINISH: "tamamlandı",
  CONTINUE: "devam ediyor",
  WAITING: "aksiyon bekliyor",
  PLANNED: "planlandı",
};
const OPERATION_APPOINTMENT_AVALIABLE_STATUS = {
  NO: "var",
  YES: "yok",
};

const COMPANY_DOCS = [
  {
    key: "identity_doc", // code içinde kullanılacak
    name: "Yetkili Kimliği", //arayüzde kullanılacak
    group: "DOCS",
    description: "identity_doc",
  },
  {
    key: "adress_doc", // code içinde kullanılacak
    name: "İkamet Belgesi", //arayüzde kullanılacak
    group: "DOCS",
    description: "adress_doc",
  },
  {
    key: "customs_doc", // code içinde kullanılacak
    name: "Vergi levhası", //arayüzde kullanılacak
    group: "DOCS",
    description: "customs_doc",
  },
  {
    key: "signature_doc", // code içinde kullanılacak
    name: "İmza beyannamesi", //arayüzde kullanılacak
    group: "DOCS",
    description: "signature_doc",
  },
];

const ROLES_LIST = {
  ADMIN: "admin",
  MANAGER: "yönetici",
  EMPLOYEE: "personel",
  RECEPTION: "resepsiyon",
  FINANCE: "muhasebe",
};
const DOC_STATUS = {
  WAITING: "onay bekliyor",
  REJECTED: "reddedildi",
  APPROVED: "onaylandı",
};
const SMS_PACKAGE_STATUS = {
  "-4": "İptal Edildi",
  "-3": "Gönderim Başarısız Oldu",
  "-2": "Paket Oluşturma Başarısız oldu",
  "-1": "Paket Operatör Tarafından Reddedildi",
  0: "Kaydediliyor",
  1: "Beklemede",
  2: "Kuyruklanıyor",
  3: "Gönderiliyor",
  4: "Gönderildi",
  5: "Kısmen Raporlandı",
  6: "Tamamlandı",
};
const SMS_STATUS = {
  "-2": "İptal edildi",
  "-1": "Operatör tarafından reddedildi",
  0: "Beklemede",
  1: "Gönderiliyor",
  2: "Gönderildi",
  3: "Numaraya iletildi",
  4: "Numaraya iletilemedi",
  5: "Zamanaşımına uğradı ",
};
const LOG_LEVELS = {
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
  DEBUG: "DEBUG",
  VERBOSE: "VERBOSE",
  HTTP: "HTTP",
};

const ORDER_STATUS_LIST = ["açık", "close", "cancel"];

export {
  APPOINTMENT_STATUS,
  LOG_LEVELS,
  APPOINTMENT_STATUS_AUTOMATIC,
  SERVICES_LIST,
  OPERATION_STATUS,
  ROLES_LIST,
  ORDER_STATUS_LIST,
  SESSION_STATUS_LIST,
  OPERATION_STATUS_AUTOMATIC,
  PAYMENT_STATUS,
  OPERATION_APPOINTMENT_AVALIABLE_STATUS,
  SESSION_STATUS_LIST_AUTOMATIC,
  DATAS_LIST,
  COMPANY_DOCS,
  DOC_STATUS,
  SMS_PACKAGE_STATUS,
  SMS_STATUS,
};
