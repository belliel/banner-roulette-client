import React, { useEffect, useState, useRef } from "react"
import { 
    Box, 
    InputGroup, 
    Input, 
    Button, 
    Container, 
    Fade, 
    ScaleFade, 
    Slide, 
    SlideFade,
    InputRightElement,
    FormLabel,
    Heading,
    FormControl,
    Flex,
    Image,
    Checkbox,
} from "@chakra-ui/react"

import { Link as RouterLink } from "react-router-dom"
import requests from "../../helpers/requests"

const getBannersByPage = (page, setBanners) => {
    requests.Get(`v1/banners?page=${page}`)
        .then(resp => resp.json())
        .then(data => setBanners(data))
        .catch(err => console.log)
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function rfc3339(d) {
    
    function pad(n) {
        return n < 10 ? "0" + n : n;
    }

    function timezoneOffset(offset) {
        var sign;
        if (offset === 0) {
            return "Z";
        }
        sign = (offset > 0) ? "-" : "+";
        offset = Math.abs(offset);
        return sign + pad(Math.floor(offset / 60)) + ":" + pad(offset % 60);
    }

    return d.getFullYear() + "-" +
        pad(d.getMonth() + 1) + "-" +
        pad(d.getDate()) + "T" +
        pad(d.getHours()) + ":" +
        pad(d.getMinutes()) + ":" +
        pad(d.getSeconds()) + 
        timezoneOffset(d.getTimezoneOffset());
}

const getZeroValueBanner = () => {
    return {
        id: "",
        name: "",
        raw_html: "",
        image_uri: "",
        size: "",
        uri: "",
        alt: "",
        show_start_date: "",
        show_end_date: "",
        show_count_cap: -1,
        show_count_per_guest: 0,
        show_hour_start: 1,
        show_hour_end: 24,
        show_count: 0,
        visible: false,
    }
}

const uploadImage = async (e, banner, setBanner) => {
    
    const formData = new FormData()

    const image = e.target.files.length ? e.target.files[0] : null

    if (image === null) {
        return
    }

    formData.append("image", image)

    const response = await requests.Post(`v1/banners/images/upload`, formData)

    if (response.status === 200) {
        const image_uri = (await response.json()).image_uri
        setBanner({...banner, image_uri: image_uri})
    } else {
        const error = (await response.json()).error
        setBanner({...banner, image_uri: error})
    }

    console.log(banner)
}

const save = async (banner, setBanner, banners, setBanners, setWindowState) => {

    try {
        banner.show_start_date = rfc3339(new Date(banner.show_start_date))
        banner.show_end_date = rfc3339(new Date(banner.show_end_date))
        banner.show_count_cap = parseInt(banner.show_count_cap)
        banner.show_count_per_guest = parseInt(banner.show_count_per_guest)
        banner.show_hour_start = parseInt(banner.show_hour_start)
        banner.show_hour_end = parseInt(banner.show_hour_end)
        banner.show_count = parseInt(banner.show_count)
        if (isNaN(banner.show_count_cap)
            || isNaN(banner.show_count_per_guest)
            || isNaN(banner.show_hour_start)
            || isNaN(banner.show_hour_end)
            || isNaN(banner.show_count)) {
                console.log("nan")
                return
        }
    } catch (error) {
        console.log(error)
    }

    const uri = "v1/banners"

    console.log(banner)

    const response = await (banner.id === "" 
        ? requests.Post(uri, JSON.stringify({...banner, id: null}))
        : requests.Put(uri, JSON.stringify(banner)))

    if (response.status === 200 || response.status === 201) {

        const index = banners.findIndex(x => x.id === banner.id)

        if (index !== -1) {
            banners[index] = banner
            setBanners(banners)
        }


        setBanner(getZeroValueBanner())
        setWindowState("banners")
        getBannersByPage(1, setBanners)
    } else {
        alert(response.status)
    }

}

const cancel = async (banner, setBanner, setWindowState) => {
    setBanner(getZeroValueBanner())
    setWindowState("banners")
}


const regexpURL = new RegExp(`(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})`)

const Banners = () => {
    const inputRef = useRef(null);
    const [windowState, setWindowState] = useState("banners")
    const [banner, setBanner] = useState(getZeroValueBanner())
    const [banners, setBanners] = useState([])
    const [page, setPage] = useState(1)

    useEffect(() => {
        getBannersByPage(page, setBanners)
    }, [page])



    return <Box p={4}>
        <Box p={banners.length ? 10 : 0}>
            {
                windowState === "banners"
                    ? <Flex width="full" flexDirection={"column"}>
                        {
                            banners.map(el => <Box key={el.id} display={"flex"} flexDirection={"row"} borderRadius={"base"} width="full" my={1} backgroundColor={el.visible ? `green.100` : `red.100`}>
                                <Box marginRight={10} boxSize={"fit-content"}>
                                    {
                                        el.image_url?.match(regexpURL)
                                            ? <Image src={`${el.image_uri}`} alt={el.alt} />
                                            : <Image src={`${requests.baseurl}/${el.image_uri}`} alt={el.alt} />
                                    }
                                </Box>
                                <Box p={10} boxSize={"fit-content"} display={"flex"} flexDirection={"column"}>
                                    <Box display={"flex"} flexDirection={"column"}>
                                        <Box>
                                            Name: {el.name}
                                        </Box>
                                        <Box>
                                            Alt: {el.alt}
                                        </Box>
                                        <Box color={el.show_count_cap === 0 ? "red" : el.show_count / el.show_count_cap > 0.75 ? "red" : el.show_count / el.show_count_cap > 0.5 ? "gray" : "black"}>
                                            Show count: {el.show_count} / {el.show_count_cap}
                                        </Box>
                                    </Box>
                                    <Box my={4}>
                                        <Button marginRight={2} colorScheme={"blue"} value={el.id} onClick={e => {
                                            setWindowState("edit")
                                            const b = banners.find(b => b.id === e.target.value)
                                            b.show_start_date = formatDate(new Date(b.show_start_date))
                                            b.show_end_date = formatDate(new Date(b.show_end_date))
                                            setBanner(b)
                                        }}>Edit</Button>
                                        <Button marginRight={2} colorScheme={"red"} value={el.id} onClick={e => {
                                            const b = banners.filter(b => b.id !== e.target.value)
                                            setBanners(b)
                                            requests.Delete(`v1/banners/${el.id}`)
                                        }}>Delete</Button>
                                    </Box>
                                </Box>
                            </Box>)
                        }
                    </Flex>
                    : <Flex width="full" justifyContent="center">
                        <Box m={2} p={2}>
                            <Box textAlign="center">
                                <Heading>Banner edit</Heading>
                            </Box>
                            <Box my={4} textAlign="left">
                                <FormControl>
                                    <FormLabel>ID</FormLabel>
                                    <Input type="text" disabled defaultValue={banner.id || ""} />
                                </FormControl>
                                <FormControl mt={2}>
                                    <FormLabel>Name</FormLabel>
                                    <Input type="text" onChange={e => setBanner({...banner, name: e.target.value})} defaultValue={banner.name || ""} />
                                </FormControl>
                                <FormControl mt={2}>
                                    <FormLabel>Image URI</FormLabel>
                                    <Input type="text" onChange={e => setBanner({...banner, image_uri: e.target.value})} defaultValue={banner.image_uri || ""} />
                                </FormControl>
                                <FormControl mt={2}>
                                    <FormLabel>URI</FormLabel>
                                    <Input type="text" onChange={e => setBanner({...banner, uri: e.target.value})} defaultValue={banner.uri || ""} />
                                </FormControl>
                                <FormControl mt={2}>
                                    <FormLabel>Alt</FormLabel>
                                    <Input type="text" onChange={e => setBanner({...banner, alt: e.target.value})} defaultValue={banner.alt || ""} />
                                </FormControl>
                                <FormControl mt={2}>
                                    <FormLabel>Start date</FormLabel>
                                    <Input type="date" onChange={e => setBanner({...banner, show_start_date: e.target.value})} defaultValue={banner.show_start_date || ""} />
                                </FormControl>
                                <FormControl mt={2}>
                                    <FormLabel>End date</FormLabel>
                                    <Input type="date" onChange={e => setBanner({...banner, show_end_date: e.target.value})} defaultValue={banner.show_end_date || ""} />
                                </FormControl>
                                <FormControl mt={2}>
                                    <FormLabel>Show count capacity</FormLabel>
                                    <Input type="text" onChange={e => setBanner({...banner, show_count_cap: e.target.value})} defaultValue={banner.show_count_cap || -1} />
                                </FormControl>
                                <FormControl mt={2}>
                                    <FormLabel>Show hour start</FormLabel>
                                    <Input type="text" onChange={e => setBanner({...banner, show_hour_start: e.target.value})} defaultValue={banner.show_hour_start || 0} />
                                </FormControl>
                                <FormControl mt={2}>
                                    <FormLabel>Show hour end</FormLabel>
                                    <Input type="text" onChange={e => setBanner({...banner, show_hour_end: parseInt(e.target.value)})} defaultValue={banner.show_hour_end || 24} />
                                </FormControl>
                                <FormControl mt={2}>
                                    <FormLabel>Show count</FormLabel>
                                    <Input type="text" defaultValue={banner.show_count || 0} />
                                </FormControl>
                                <FormControl mt={2}>
                                    <FormLabel>Visible</FormLabel>
                                    <Checkbox type="checkbox" onChange={e => setBanner({...banner, visible: e.target.checked})} defaultChecked={banner.visible || false} />
                                </FormControl>
                            </Box>
                            
                            <Box mt={4} display={"flex"} justifyContent={"space-between"}>
                                <Button onClick={e => save(banner, setBanner, banners, setBanners, setWindowState)} colorScheme={"green"} width="half">
                                    Save
                                </Button>
                                <Button onClick={e => cancel(banner, setBanner, setWindowState)} colorScheme={"red"} width="half">
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                
                        <Box m={2} marginLeft={6} p={2}>
                            <Box textAlign="center">
                                <Heading>Banner preview</Heading>
                            </Box>
                        
                            <Box my={4} textAlign="right" boxSize="sm">
                                <FormControl>
                                    <FormLabel>Upload image</FormLabel>
                                    <Input 
                                        hidden 
                                        ref={inputRef} 
                                        type="file" 
                                        accept={"image/*"} 
                                        onChange={e => uploadImage(e, banner, setBanner)}
                                    />
                                    <Button colorScheme={"facebook"} width="full" onClick={e => inputRef.current.click()}>Upload</Button>
                                </FormControl>
                                {
                                    !banner.image_uri.startsWith("assets")
                                        ? <Image src={`${banner.image_uri}`} alt={banner.alt} />
                                        : <Image src={`${requests.baseurl}/${banner.image_uri}`} alt={banner.alt} />
                                }
                            </Box>
                        </Box>
                    </Flex>
            }
        </Box>
        <Box p={10} m={2} display={windowState === "edit" ? "none" : "block"}>
            <Button colorScheme={"facebook"} onClick={e => setWindowState("edit")}>Add banner</Button>
        </Box>
    </Box>
}



export default Banners