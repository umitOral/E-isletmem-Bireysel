export class Request {
  constructor(url) {
    this.url = url;
  }

  async get() {
    const response = await fetch(this.url);
    const responseData = await response.json();
    return responseData;
  }
  async getwithUrl(url) {
    console.log(url)
    const response = await fetch(url);
    const responseData = await response.json();
    return responseData;
  }
  
  
  async updateStateSession(url) {
    const response = await fetch(url);
    const responseData = await response.json();
    return responseData;
  }

  async post(data) {
    const response = await fetch(this.url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-type": "application/json" },
    });
    const responseData = await response.json();

    return responseData;
  }
  async postWithUrl(url, data) {
    console.log(url);
    
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-type": "application/json" },
    });
    const responseData = await response.json();

    return responseData;
  }
  async postImageWithUrl(url, formData) {
    console.log(url);
    console.log(formData);
    const response = await fetch(url, {
      method: "POST",
      
      body:formData
     
    });
    const responseData = await response.json();

    return responseData;
  }
  async postWithUrlformData(url, params) {
    
    const response = await fetch(url, {
      method: "POST",
      body:params
     
    });
    const responseData = await response.json();

    return responseData;
  }

  async createCompany(data, url) {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-type": "application/json" },
    });
    const responseData = await response.json();

    return responseData;
  }

  async put(id, data) {
    console.log(data);
    const response = await fetch(this.url + "/" + id, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-type": "application/json" },
    });
    const responseData = await response.json();

    return responseData;
  }

  async delete(id) {
    console.log(this.url + "/" + id);
    const response = await fetch(this.url + "/" + id, {
      method: "DELETE",
    });

    return "veri silindi";
  }
  async deletewithUrl(url) {
    console.log(url);
    const response = await fetch(url);
    const responseData = await response.json();
    return responseData;
  }
}
