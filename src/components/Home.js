import React from 'react';
import { Tabs, Button } from 'antd';
import {GEO_OPTIONS} from '../constants'

export class Home extends React.Component {

    componentDidMount(){
        this.getGeolocation();
    }

    getGeolocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailedLoadGeolocation,
                GEO_OPTIONS,
            );
        } else {

        }
    }

    onSuccessLoadGeoLocation = (position) => {
        console.log(position);
    }
    onFailedLoadGeolocation = () => {
        console.log("Fail to load geo location.");
    }

    render() {
        const TabPane = Tabs.TabPane;
        const operations = <Button type="primary">Create New Post</Button>;
        return (
            <Tabs tabBarExtraContent={operations} className = "main-tabs">
                <TabPane tab="Image Post" key="1">Image Posts</TabPane>
                <TabPane tab="Video Posts" key="2">Video Posts</TabPane>
                <TabPane tab="Map" key="3">Map</TabPane>
            </Tabs>
        );
    }
}
