import links from '../utils/links.csv'
import { useEffect, useState } from 'react'


const Link = ({ link }) => {
    const [linkData, setLinkData] = useState(null)
    setLinkData(links[link])
    return (
        <div>
        <a href={link}></a>
        </div>
    )
}

export default Link