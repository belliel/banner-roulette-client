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
            { body, headers }
        )
    }

    Put(uri, body, headers) {
        return fetch(
            `${this.baseurl}/${uri}`, 
            { body, headers }
        )
    }

    Delete(uri, headers) {
        return fetch(
            `${this.baseurl}/${uri}`, 
            { headers }
        )
    }
}

const baseUrl = "http://localhost:3000"

export default Fetcher(baseUrl)


