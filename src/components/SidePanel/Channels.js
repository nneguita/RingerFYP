//this is to add channels on the application
import React from 'react';
import firebase from '../../firebase';
import { Menu, Icon, Modal, Form, Input, Button, Label } from 'semantic-ui-react';
import {connect} from 'react-redux';
import {setCurrentChannel, setPrivateChannel} from '../../actions';

class Channels extends React.Component {
    state ={
        user: this.props.currentUser,
        channels:[],
        channelName: '',
        channelDetails: '',
        modal: false,
        channelsRef: firebase.database().ref('channels'),
        meesagesRef: firebase.database().ref('messages'),
        notifications: [],
        firstLoad: true,
        activeChannel: '',
        channel: null,
    };

    componentDidMount(){
        this.addListeners();
    }

    //to prevent listener listening to an event that is not happening
    componentWillUnmount() {
        this.removeListeners();
    }

    addListeners = () =>{
        let loadedChannels =[];
        this.state.channelsRef.on("child_added", snap => {
            loadedChannels.push(snap.val());
            this.setState({channels: loadedChannels}, () => this.setFirstChannel());
            this.addNotificationListener(snap.key);
        });
    };

    addNotificationListener = channelId => {
        this.state.meesagesRef.child(channelId).on('value', snap => {
            if(this.state.channel) {
                this.handleNotifications(channelId, this.state.channel.id, this.state.notifications, snap);
            }
        });
    }

    //notifications count and display
    handleNotifications = (channelId, currentChannelId, notifications, snap) => {
        let lastTotal = 0;
        let index = notifications.findIndex(notification => notification.id === channelId);
        if(index !== -1) {
            if (channelId !== currentChannelId) {
                lastTotal = notifications[index].total;
                if(snap.numChildren() - lastTotal > 0) {
                    notifications[index].count = snap.numChildren() - lastTotal;
                }
            }
            notifications[index].lastKnownTotal = snap.numChildren();
        } else {
            notifications.push({
                id: channelId, 
                total: snap.numChildren(),
                lastKnownTotal: snap.numChildren(),
                count: 0
            });
        }
        this.setState({notifications});
    }

    removeListeners = () =>{
        this.state.channelsRef.off(); //off is used so ref and child's ref listener are turned off
        this.state.channels.forEach(channel => {
            this.state.meesagesRef.child(channel.id).off();
        })
    }

    //to set the state of the channel when the app finished first load 
    setFirstChannel = () => {
        const firstChannel = this.state.channels[0];
        if(this.state.firstLoad && this.state.channels.length > 0) {
            this.props.setCurrentChannel(firstChannel);
            this.setActiveChannel(firstChannel);
            this.setState({channe: firstChannel})
            //$now--public
        }
        this.setState({firstLoad: false});
    };

    addChannel = event => { //adding the channel into the database
        const {channelsRef, channelName, channelDetails, user} = this.state;

        const key = channelsRef.push().key; //unique key for channels
    
        const newChannel = {id: key, name: channelName, details: channelDetails, 
            createdBy: {name:user.displayName, avatar: user.photoURL }
        };

        channelsRef
        .child(key)
        .update(newChannel)
        .then(() => {
            this.setState({ channelName:'', channelDetails:'' });
            this.closeModal();
            console.log('channel added');
        })
        .catch (err => {
            console.error(err);
        })
    }

    handleSubmit=event=> {
        event.preventDefault();
        if(this.isFormValid(this.state)){
            this.addChannel();
        }
    }

    handleChange=event=>{
        this.setState({[event.target.name]: event.target.value});
    };
    
    //to change the state of redux when selecting a channel which is to show its details
    changeChannel = channel => {
        this.setActiveChannel(channel);
        this.clearNotifications();
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
        this.setState({channel});
    };

    //when user opens the group with notif on it, this will clears it
    clearNotifications = () => {
        let index = this.state.notifications.findIndex(notification => notification.id === this.state.channel.id);
        if(index !== -1) {
            let updatedNotifications =[...this.state.notifications];
            updatedNotifications[index].total = this.state.notifications[index].lastKnownTotal;
            updatedNotifications[index].count = 0;
            this.setState({notifications: updatedNotifications});
        }
    }

    //channel indicator to see which channel we are on
    setActiveChannel = channel => {
        this.setState({activeChannel: channel.id});
    };

    getNotificationCount = channel => {
        let count=0;
        
        this.state.notifications.forEach(notification => {
            if(notification.id === channel.id) {
                count = notification.count;
            }
        });

        if(count > 0) {
            return count;
        }
    }

    displayChannels = channels => (
        channels.length > 0 && channels.map(channel => (
            <Menu.Item
            key = {channel.id}
            onClick={() => this.changeChannel(channel)}
            name ={channel.name}
            style={{opacity:0.7}}
            active={channel.id === this.state.activeChannel}>
                {this.getNotificationCount(channel) && (
                    <Label color ="red">
                    {this.getNotificationCount(channel)
                    }</Label>
                )}
            #{channel.name}
            </Menu.Item>
        ))
    )

    isFormValid = ({channelName, channelDetails}) => channelName && channelDetails; //to make sure there is value on them

    openModal = () =>this.setState({modal:true});
    closeModal = () =>this.setState({modal:false}); //to properly close the pop up

    render() {
        const {channels, modal} =this.state;

        return (
            //fragment is used to wrap the modal function so it would not cause errors
            <React.Fragment>
            {/*child menu of sidepanel, numbers of channels included*/}
            <Menu.Menu className="menu">
                <Menu.Item>
                    <span>
                        <Icon name="exchange" /> CHANNELS
                    </span> {''}
                    ({channels.length}) <Icon name ="add" onClick={this.openModal} />
                </Menu.Item>
                {/* Channels */} 
                {this.displayChannels(channels)}
            </Menu.Menu>

            {/*add channel modal*/}
            <Modal basic open ={modal} onClose={this.closeModal} >
                <Modal.Header>
                    Add a Channels
                </Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Field>
                            <Input fluid label="Name of Channel" name="channelName" onChange={this.handleChange} />
                        </Form.Field>
                        <Form.Field>
                            <Input fluid label="Channel Desciption" name="channelDetails" onChange={this.handleChange} />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="green" inverted onClick={this.handleSubmit}>
                        <Icon name = "checkmark" /> Add
                    </Button>
                    <Button color="red" inverted onClick={this.closeModal}>
                        <Icon name = "checkmark" /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
            </React.Fragment>
        );
    }
}

export default connect(null, {setCurrentChannel, setPrivateChannel})(Channels);