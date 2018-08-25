import React from 'react';
import {Tabs, Spin, Row, Col, Radio} from 'antd';
import {API_ROOT, GEO_OPTIONS, POS_KEY, TOKEN_KEY, AUTH_PREFIX} from '../constants'
import $ from 'jquery';
import {Gallery} from './Gallery'
import {CreatePostButton} from './CreatePostButton'
import {WrappedAroundMap} from './AroundMap'

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


    getPanelContent = (type) => {
        if (this.state.error) {
            return <div>{this.state.error}</div>;
        } else if (this.state.loadingGeoLocation) {
            return <Spin tip="Loading geo location..."/>;
        } else if (this.state.loadingPosts) {
            return <Spin tip="Loading posts..."/>;
        } else if (this.state.posts) {
            return type === 'image' ? this.getImagePosts() : this.getVideoPosts();
        } else {
            return <div>Nothing found...</div>;
        }
    }


    getImagePosts = () => {
        const images = this.state.posts
            .filter((post) => post.type === 'image')
            .map((post) => {
                return {
                    user: post.user,
                    src: post.url,
                    thumbnail: post.url,
                    caption: post.message,
                    thumbnailWidth: 400,
                    thumbnailHeight: 300,
                };
            });
        return (
            <div>
                <Gallery images={images}/>
            </div>
        );
    }

    getVideoPosts = () => {
        return (
            <Row gutter={32}>
                {
                    this.state.posts
                        .filter((post) => post.type === 'video')
                        .map((post) => {
                            return (
                                <Col span={6} >
                                    <video src={post.url} key={post.url} controls className="video-block"/>
                                    <p>{post.user}: {post.message}</p>
                                </Col>);
                        })
                }
            </Row>
        );
    }


    loadNearbyPosts = (location, range) => {
        this.setState({ loadingPosts: true, error: '' });
        const { lat, lon } = location ? location : JSON.parse(localStorage.getItem(POS_KEY));
        const radius = range ? range : 20;
        $.ajax({
            url: `${API_ROOT}/search?lat=${lat}&lon=${lon}&range=${radius}`,
            method: 'GET',
            headers: {
                Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`,
            },
        }).then((response) => {
            console.log(response);
            this.setState({ posts: response || [],loadingPosts: false, error: '' });
        }, (response) => {
            console.log(response.responseText);
            this.setState({ loadingPosts: false, error: 'Failed to load posts!' });
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
                    {this.getPanelContent('image')}
                </TabPane>
                <TabPane tab="Video Posts" key="2">
                    {this.getPanelContent('video')}
                </TabPane>
                <TabPane tab="Map" key="3">
                    <WrappedAroundMap
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD3CEh9DXuyjozqptVB5LA-dN7MxWWkr9s&v=3.exp&libraries=geometry,drawing,places"
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `600px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        posts={this.state.posts}
                        loadNearbyPosts={this.loadNearbyPosts}
                    />
                </TabPane>
            </Tabs>
        );
    }
}
