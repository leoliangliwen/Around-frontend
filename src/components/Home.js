import React from 'react';
import {Tabs, Spin} from 'antd';
import {API_ROOT, GEO_OPTIONS, POS_KEY, TOKEN_KEY, AUTH_PREFIX} from '../constants'
import $ from 'jquery';
import {Gallery} from './Gallery'
import {CreatePostButton} from './CreatePostButton'

export class Home extends React.Component {

    state = {
        loadingGeoLocation: false,
        loadingPosts: false,
        error: '',
        posts: '',
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
        this.loadNearbyPosts();
    }

    onFailedLoadGeolocation = () => {
        console.log("Fail to load geo location.");
        this.setState({loadingGeoLocation: false, error: "Fail to load geolocation."});
    }

    getResult = () => {
        if (this.state.error) {
            return <div>{this.state.error}</div>
        } else if (this.state.loadingGeoLocation) {
            return <Spin tip='Loading Geolocation...'/>
        } else if (this.state.posts && this.state.posts.length > 0) {
            const images = this.state.posts.map((post) => {
                return {
                    user: post.user,
                    src: post.url,
                    thumbnail: post.url,
                    thumbnailWidth: 400,
                    thumbnailHeight: 300,
                    caption: post.message,
                }
            });
            return <Gallery images = {images}/>
        }
        else if (this.state.loadingPosts){
            return <Spin tip='Loading Posts...'/>
        }
    }

    loadNearbyPosts() {
        this.setState({ loadingPost: true});
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
            this.setState({
                posts: response,
                loadingPosts: false,
                error: '',
                loadingPost: false});
            console.log(response);
        }, (error) => {
            this.setState({
                loadingPosts: false,
                error: error.responseText,
                loadingPost: false });
            console.log(error);
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        const TabPane = Tabs.TabPane;
        const createPostButton = <CreatePostButton loadNearbyPosts={this.loadNearbyPosts}/>;
        return (
            <Tabs tabBarExtraContent={createPostButton} className = "main-tabs">
                <TabPane tab="Image Post" key="1">
                    {this.getResult()}
                </TabPane>
                <TabPane tab="Video Posts" key="2">Video Posts</TabPane>
                <TabPane tab="Map" key="3">Map</TabPane>
            </Tabs>
        );
    }
}
