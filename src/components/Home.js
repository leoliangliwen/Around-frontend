import React from 'react';
import {Tabs, Button, Spin, message} from 'antd';
import {API_ROOT, GEO_OPTIONS, POS_KEY, TOKEN_KEY, AUTH_PREFIX} from '../constants'
import $ from 'jquery';

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
        this.loadNearbyPost();
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

    loadNearbyPost() {
        const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
        const token = localStorage.getItem(TOKEN_KEY);
        this.setState({ loadingPosts: true, error: ''});
        $.ajax({
            url: `${API_ROOT}/search?lat=${lat}&lon=${lon}&range=20000`,
            method: 'GET',
            headers: {
                Authorization: `${AUTH_PREFIX} ${token}`
            },
        }).then((response) => {
            this.setState({ posts: response, loadingPosts: false, error: '' });
            console.log(response);
        }, (error) => {
            this.setState({ loadingPosts: false, error: error.responseText });
            console.log(error);
        }).catch((error) => {
            console.log(error);
        });
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
