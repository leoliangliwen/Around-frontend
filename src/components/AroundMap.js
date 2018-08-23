import React from 'react';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
} from 'react-google-maps';
import {AroundMarker} from './AroundMarker'
import {POS_KEY} from '../constants'

class AroundMap extends React.Component{

    render() {
        const position = JSON.parse(localStorage.getItem(POS_KEY));
        return (
            <GoogleMap
                defaultZoom={11}
                defaultCenter={{ lat: position.lat, lng: position.lon }}
            >
                {
                    this.props.posts.map((post) =>{
                        return <AroundMarker post = {post} key = {post.url}/>
                    })
                }
            </GoogleMap>
        );

    }
}

export const WrappedAroundMap = withScriptjs(withGoogleMap(AroundMap))