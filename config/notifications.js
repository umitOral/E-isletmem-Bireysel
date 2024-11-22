export const NOTIFICATIONS = {
    notificationGroups: [
      {
        id: "MAIL",
        name: "Mail Bildirimleri",
      },
      {
        id: "SMS",
        name: "Sms Bildirimleri",
      },
    ],
    notifications: [
      {
        key: "user_appointment_mail",  // code içinde kullanılacak
        name: "Randevu Oluşturuldu Maili", //arayüzde kullanılacak
        group: "MAIL",
        category:"USERS",
        description: "", 
      },
      {
        key: "user_appointment_last_day_mail",  // code içinde kullanılacak
        name: "Son gün Randevu Maili", //arayüzde kullanılacak
        group: "MAIL",
        category:"USERS",
        description: "", 
      },
      {
        key: "user_appointment_sms",  // code içinde kullanılacak
        name: "Randevu Sms", //arayüzde kullanılacak
        group: "SMS",
        category:"USERS",
        description: "User View", 
      },
     
      {
        key: "daily_checkout_report",  // code içinde kullanılacak
        name: "Günlük Kasa Rapor Maili", //arayüzde kullanılacak
        group: "MAIL",
        category:"EMPLOYES",
        description: "Company Daily Report", 
      },
  
    ],
  };