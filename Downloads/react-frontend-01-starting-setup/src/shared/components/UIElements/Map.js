import React, {useRef, useEffect} from 'react';

import './Map.css'
const Map = props => {
    const mapRef = useRef();
    const {center, zoom } = props;
    useEffect(()=> {
        const map = mapRef.current;
    },[center, zoom])

   
return <div ref ={mapRef} className={`map ${props.className}`} style = {props.style }>
    <h2> lat: {center.lat}</h2>
    <h2> lng: {center.lng}</h2>
    <h2>zoom: {zoom}</h2>
</div>
};

export default Map;
