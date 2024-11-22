

const createSmsAuthorization = async (company) => {
  let bytes = CryptoJS.AES.decrypt(company.smsConfig.password,process.env.JWT_SECRET);
    let decodedPassword = bytes.toString(CryptoJS.enc.Utf8);
    // console.log("decodedPassword:"+decodedPassword)
    // console.log("decodedPassword:"+company.smsConfig.userName)
    const combinedString = `${company.smsConfig.userName}:${decodedPassword}`;
    const base64Encoded = Buffer.from(combinedString).toString("base64");
    
    // console.log(Buffer.from("YmF5aWRlbW86NU1KejRaYjJOTEVK", 'base64').toString('ascii'))

    return `Basic ${base64Encoded}`;
  };

  export {createSmsAuthorization}