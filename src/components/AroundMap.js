import React from 'react';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
} from 'react-google-maps';
import {AroundMarket} from './AroundMarket'

class AroundMap extends React.Component{

    render() {
        return (
            <GoogleMap
                defaultZoom={8}
                defaultCenter={{ lat: -34.797, lng: 150.744 }}
            >
                <AroundMarket position = {{lat: -34.897, lng: 150.944 }}/>
                <AroundMarket position = {{lat: -34.697, lng: 150.644 }}/>

            </GoogleMap>
        );

    }
}

export const WrappedAroundMap = withScriptjs(withGoogleMap(AroundMap))