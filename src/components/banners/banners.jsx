import React, { useState } from "react"
import requests from "../../helpers/requests"
import style from "../../style/banner.module.css"

const getBannersByPage = (page, setter) => {
    requests.Get(`v1/banners?page=${page}`)
        .then(resp => resp.json())
        .then(data => setter(data))
}








const Banners = () => {

    const [banners, setBanners] = useState([])
    const [page, setPage] = useState(1)

    getBannersByPage(page, setBanners)

    return <div className={style.banners}>
        {
            banners.map(
                el => <div className={style.banner}>
                    el.Name
                </div>
            )
        }
    </div>
}


export default Banners