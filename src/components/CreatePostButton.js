import React from 'react';
import { Modal, Button,message } from 'antd';
import {WrappedCreatePostForm} from './CreatePostForm'
import $ from 'jquery';
import {API_ROOT, POS_KEY, TOKEN_KEY, AUTH_PREFIX} from '../constants'

export class CreatePostButton extends React.Component {
    state = {
        visible: false,
        confirmLoading: false,
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    saveFormRef = (form) => {
        this.form = form;
    }
    handleOk = () => {
        this.setState({ confirmLoading: true });
        this.form.validateFields((err, values) => {
            if (!err) {
                const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
                const formData = new FormData();
                formData.set('lat', lat);
                formData.set('lon', lon);
                formData.set('message', values.message);
                formData.set('image', values.image[0].originFileObj);

                $.ajax({
                    url: `${API_ROOT}/post`,
                    method: 'POST',
                    data: formData,
                    headers: {
                        Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`,
                    },
                    processData: false,
                    contentType: false,
                    dataType: 'text',
                }).then((response) => {
                    message.success('Created a post successfully!');
                    this.form.resetFields();
                    this.setState({ visible: false, confirmLoading: false });
                    this.props.loadNearbyPosts();
                }, (response) => {
                    message.error(response.responseText);
                    this.setState({ visible: false, confirmLoading: false });
                }).catch((error) => {
                    console.log(error);
                });
            }
        });
    }

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    }

    render() {
        const { visible, confirmLoading} = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>Create New Pos</Button>
                <Modal title="Create New Post"
                       visible={visible}
                       onOk={this.handleOk}
                       confirmLoading={confirmLoading}
                       onCancel={this.handleCancel}
                       okText="Create"
                >
                    <WrappedCreatePostForm  ref={this.saveFormRef}/>
                </Modal>
            </div>
        );
    }
}

