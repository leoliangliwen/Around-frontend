import React from 'react';
import { Tabs, Button, Spin } from 'antd';
import {GEO_OPTIONS, POS_KEY} from '../constants'

export class Home extends React.Component {

    state = {
        loadingGeoLocation: false,
        error: '',
    }



    componentDidMount(){
        this.setState({loadingGeoLocation: true});
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
            this.setState({loadingGeoLocation: false, error: "Your browser does not support geolocation."});
        }
    }

    onSuccessLoadGeoLocation = (position) => {
        this.setState({loadingGeoLocation: false});
        console.log(position);
        const { latitude, longitude } = position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({lat: latitude, lon: longitude}));
    }

    onFailedLoadGeolocation = () => {
        console.log("Fail to load geo location.");
        this.setState({loadingGeoLocation: false, error: "Fail to load geolocation."});
    }

    getResult = () => {
        if (this.state.error) {
            return <div>{this.state.error}</div>
        } else if (this.state.loadingGeoLocation) {
            return <Spin tip='Loading...'/>
        } else {
            return <div>'Image Post'</div>;
        }

    }

    render() {
        const TabPane = Tabs.TabPane;
        const operations = <Button type="primary">Create New Post</Button>;
        return (
            <Tabs tabBarExtraContent={operations} className = "main-tabs">
                <TabPane tab="Image Post" key="1">
                    {this.getResult()}
                </TabPane>
                <TabPane tab="Video Posts" key="2">Video Posts</TabPane>
                <TabPane tab="Map" key="3">Map</TabPane>
            </Tabs>
        );
    }
}
