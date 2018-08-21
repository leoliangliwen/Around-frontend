import React from 'react';
import { Form, Input, Upload, Icon,} from 'antd';

export class CreatePostForm extends React.Component {
    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        const FormItem = Form.Item;

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    label="Message"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 12 }}
                >
                    {getFieldDecorator('note', {
                        rules: [{ required: true, message: 'Please input your message!' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    label="Image"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 12 }}
                >
                    <div className="dropbox">
                        {getFieldDecorator('dragger', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                            rules: [{ required: true, message: 'Please select an image to upload!' }],
                        })(
                            <Upload.Dragger name="files" action="/upload.do">
                                <p className="ant-upload-drag-icon">
                                    <Icon type="inbox" />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                            </Upload.Dragger>
                        )}
                    </div>
                </FormItem>
            </Form>
        );
    }
}

export const WrappedCreatePostForm = Form.create()(CreatePostForm);
