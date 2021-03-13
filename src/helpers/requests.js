class Fetcher {

    baseurl = ""


    constructor(baseUrl) {
        this.baseurl = baseUrl
    }

    Get(uri, headers) {
        return fetch(
            `${this.baseurl}/${uri}`, 
            { headers }
        )
    }

    Post(uri, body, headers) {
        return fetch(
            `${this.baseurl}/${uri}`, 
            { method: "POST", body, headers }
        )
    }

    Put(uri, body, headers) {
        return fetch(
            `${this.baseurl}/${uri}`, 
            { method: "PUT", body, headers }
        )
    }

    Delete(uri, headers) {
        return fetch(
            `${this.baseurl}/${uri}`, 
            { method: "DELETE", headers }
        )
    }
}

const baseUrl = "http://localhost:5000"

export default new Fetcher(baseUrl)


