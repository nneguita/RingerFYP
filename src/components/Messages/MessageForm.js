import React from 'react';
import { Button, Input, Segment } from 'semantic-ui-react';
//to create random string to bound media upload
import uuidv4 from 'uuid/v4';
import firebase from '../../firebase';
import FileModal from './FileModal';
import ProgressBar from './ProgressBar';

class MessageForm extends React.Component {
    state = {
        storageRef: firebase.storage().ref(),
        uploadState: '',
        uploadTask: null,
        percentUploaded: 0,
        message: '',
        loading: false,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        errors: [],
        modal: false
    };

    /*componentWillUnmount(){
        if(this.state.uploadTask !== null) {
            this.state.uploadTask.cancel();
            this.setState({uploadTask: null});
        }
    }*/

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    createMessage = (fileUrl = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
        };
        if (fileUrl !== null) {
            message['image'] = fileUrl; //to detect message in media form
        } else {
            message['content'] = this.state.message; //to detect message in word form
        }
        return message;
    }

    //recording message history in database
    sendMessage = () => {
        const { getMessagesRef } = this.props;
        const { message, channel } = this.state;

        if (message) {
            //send message
            this.setState({ loading: true });

            getMessagesRef()
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState({ loading: false, message: '', errors: [] })
                })
                .catch(err => {
                    console.error(err);
                    this.setState({
                        loading: false,
                        errors: this.state.errors.concat(err)
                    })
                })
        } else {
            this.setState({
                errors: this.state.errors.concat({ message: 'Add a message' })
            });
        }
    };

    getPath =() =>{
        if(this.props.isPrivateChannel) {
            return `chat/private-${this.state.channel.id}`;
        } else {
            return 'chat/public';
        }
    }

    uploadFile = (file, metadata) => {
        const pathToUpload = this.state.channel.id;
        const ref = this.props.getMessagesRef();
        const filePath = `${this.getPath()}${uuidv4()}.jpg`;

        this.setState({
            uploadState: 'uploading',
            uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
        },
            () => {
                this.state.uploadTask.on('state_changed', snap => {
                    const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                    this.props.isProgressBarVisible(percentUploaded);
                    this.setState({ percentUploaded });
                },
                    err => {
                        console.error(err);
                        this.setState({
                            errors: this.state.errors.concat(err),
                            uploadState: 'error',
                            uploadTask: null
                        })
                    },
                    () => {
                        this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
                            this.sendFileMessage(downloadUrl, ref, pathToUpload);
                        })
                            .catch(err => {
                                console.error(err);
                                this.setState({
                                    errors: this.state.errors.concat(err),
                                    uploadState: 'error',
                                    uploadTask: null
                                })
                            })
                    })
            })
    };

    handleKeyDown = event => {
        if(event.ctrlKey && event.keyCode=== 13){
            this.sendMessage();
        }
    }

    sendFileMessage = (fileUrl, ref, pathToUpload) => {
        ref.child(pathToUpload)
            .push()
            .set(this.createMessage(fileUrl))
            .then(() => {
                this.setState({ uploadState: 'done' })
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    errors: this.state.errors.concat(err)
                })
            })
    }

    render() {
        const { errors, message, loading, modal, percentUploaded, uploadState } = this.state;

        return (
            <Segment className="message__form">
                <Input fluid name="message"
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                    value={message}
                    style={{ marginBottom: '0.7em' }}
                    label={<Button icon='add' />} labelPosition="left" placeholder="Write Your Message"
                    className={
                        errors.some(error => error.message.includes('message')) ? 'error' : ''
                    } />
                <Button.Group icon widths="2">
                    <Button color="orange"
                        onClick={this.sendMessage}
                        disabled={loading}
                        content="Add Reply" labelPosition="left" icon="edit" />
                    <Button color="teal"
                        disabled={uploadState === "uploading"}
                        onClick={this.openModal}
                        content="Upload Media" labelPosition="right" icon="cloud upload" />
                </Button.Group>
                    <FileModal
                        modal={modal}
                        closeModal={this.closeModal}
                        uploadFile={this.uploadFile} />
                        <ProgressBar 
                        uplaodState = {uploadState}
                        percentUploaded = {percentUploaded} />
            </Segment>
        );
    }
}

export default MessageForm;