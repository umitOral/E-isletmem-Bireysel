export class Request {
    constructor(url) {
        this.url = url
    }

    async get() {
        const response = await fetch(this.url)
        const responseData = await response.json()

        return responseData

    }
    async getdeneme(url) {

       console.log(url)
        const response = await fetch(url)

        const responseData = await response.json()
        console.log(responseData)
        return responseData

    }
    async post(data) {
        const response = await fetch(this.url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json" }
        })
        const responseData = await response.json()

        return responseData

    }

    async put(id, data) {
        console.log(data)
        const response = await fetch(this.url + "/" + id, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json" }
        })
        const responseData = await response.json()

        return responseData

    }


    async delete(id) {
        console.log(this.url + "/" + id)
        const response = await fetch(this.url + "/" + id, {
            method: "DELETE"
        })

        return ("veri silindi")

    }

}

