import React, { useEffect, useState } from "react"
import { Center, Box, Heading, Image } from "@chakra-ui/react"
import requests from "../../helpers/requests"

const regexpURL = new RegExp(`[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)`)


const Home = () => {
    const [loading, setLoading] = useState(false)
    const [banner, setBanner] = useState({})
    const [page, setPage] = useState(1)
    
    useEffect(() => {
        setLoading(true)
        requests.Get(`v1/banners/random?hour=${new Date().getHours()}`)
            .then(resp => resp.json())
            .then(data => {
                setLoading(false)

                if (data.error != null) {
                    return
                }
                setBanner(data)
                requests.Put(`v1/banners/banner-${data.id}`)
                    .catch(err => console.log)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }, [page])

    return <Center display={"flex"} flexDirection={"column"} bg="white" h="100vh" color="black">
        { 
            loading 
            ? (<Box>
                    <Heading>Загрузка</Heading>
                    <Heading>50%</Heading>
                    <Box>
                        
                    </Box>
                </Box>)
            : banner.id
                ? (<Box display={"flex"} flexDirection={"column"} alignItems={"center"}> 
                        <Heading>{banner.name}</Heading>
                        <Box>
                            <a href={banner.uri} target={"_blank"} rel="noreferrer">
                                {
                                    banner.image_url?.match(regexpURL)
                                        ? <Image src={`${banner.image_uri}`} alt={banner.alt} />
                                        : <Image src={`${requests.baseurl}/${banner.image_uri}`} alt={banner.alt} />
                                }
                            </a>
                        </Box>
                        <Heading>{banner.show_count} Просмотров</Heading>
                    </Box>)
                : (<Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                        <Heading>Пока нет баннера</Heading>
                        <Heading></Heading>
                        <Box>
                            
                        </Box>
                    </Box>)
        }
        
  </Center>
}

export default Home
