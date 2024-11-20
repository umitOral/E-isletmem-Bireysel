export const notifications = {
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
        name: "Randevu Maili", //arayüzde kullanılacak
        group: "MAIL",
        category:"USERS",
        description: "User View", 
      },
      {
        key: "user_appointment_sms",  // code içinde kullanılacak
        name: "Randevu Sms", //arayüzde kullanılacak
        group: "SMS",
        category:"USERS",
        description: "User View", 
      },
  
    ],
  };