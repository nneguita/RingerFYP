import React from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from '../../firebase';
import {connect} from 'react-redux';
import {setUserPosts} from '../../actions';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';

class Messages extends React.Component {

    state = {
        privateChannel: this.props.isPrivateChannel,
        messagesRef: firebase.database().ref('messages'),
        privateMessagesRef: firebase.database().ref('privateMessages'),
        channel: this.props.currentChannel, 
        messagesLoading: true,
        messages: [],
        user: this.props.currentUser,
        progressBar: false,
        numUniqueUsers: '',
        searchTerm: '',
        searchLoading: false,
        searchResult: [],
        isChannelStarred: false,
        listener:[]
    };

    componentDidMount(){
        const {channel, user} = this.state;

        if(channel && user) {
            //this.removeListeners(listeners);
            this.addListener(channel.id);
        }
    }

    /*componentWillUnmount() {
        this.removeListeners(this.state.listeners);
        this.state.connectedRef.off();
    }

    removeListeners = listeners =>{
        listeners.forEach(listener=>{
            listener.ref.child(listener.id).off(listener.event);
        })
    }*/

    componentDidUpdate(prevProps, prevState){
        if(this.messageEnd) {
            this.scrollToBottom();
        }
    }

    //addToListeners =(id, ref, event) => {
       // const index = this.state.listeners.findIndex(listener=> {
           // return listener.id === id && listener.ref === ref && listener.event === event;
      //  })
      //  if(index === -1) {
      //      const newListener = {id, ref, event};
      //      this.setState({listeners: this.state.listeners.concat(newListener)});
      //  }
  //  }

    scrollToBottom = () => {
        this.messageEnd.scrollIntoView({behavior:'smooth'});
    }

    //do display chat
    addListener = channelId => {
        this.addMessageListener(channelId);
    }

    addMessageListener = channelId => {
        let loadedMessages = [];
        const ref = this.getMessagesRef();
        ref.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val());
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            });
            this.countUniqueUser(loadedMessages);
            this.countUserPost(loadedMessages);
        });
        //this.addToListeners(channelId, ref, 'child_added');
    };

    getMessagesRef = () => {
        const {messagesRef, privateMessagesRef, privateChannel} = this.state;
        return privateChannel ? privateMessagesRef : messagesRef;
    }

    handleSearchChange = event => {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true
        }, () => this.handleSearchMessages());
    }

    handleSearchMessages = () => {
        const channelMessages =[...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, 'gi');
        const searchResult = channelMessages.reduce((acc, message) => {
            if((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
                acc.push(message);
            }
            return acc;
        }, []);
        this.setState({searchResult});
        setTimeout(() => this.setState({searchLoading: false}), 1000);
    }

    countUniqueUser = messages => {
        //using reducer to get a certain accumulated of value of a certain operation
        const uniqueUser = messages.reduce((acc, message) =>{
            if(!acc.includes(message.user.name)) {
                acc.push(message.user.name);
            }
            return acc;
        },[]);
        const plural = uniqueUser.length > 1 || uniqueUser.length === 0;
        const numUniqueUsers = `${uniqueUser.length} user${plural ? "s": ""}`;
        this.setState({numUniqueUsers});
    }

    countUserPost = messages => {
        let userPosts = messages.reduce((acc, message) => {
            if(message.user.name in acc){
                acc[message.user.name].count += 1;
            } else {
                acc[message.user.name] ={
                    avatar: message.user.avatar,
                    count: 1
                }
            }
            return acc;
        }, {});
        this.props.setUserPosts(userPosts);
    };

    displayMessages = messages => (
        messages.length > 0 && messages.map(message => (
            <Message key={message.timestamp} message = {message}
            user = {this.state.user} />
        ))
    );

    isProgressBarVisible = percent => {
        if (percent > 0) {
            this.setState({progressBar: true})
        }
    };

    displayChannelName = channel => {
        return channel ? `#${this.state.privateChannel ? '@' : '#'}${channel.name}` : ''; 
    }

    render() {
        //pretier-ignore 
        const { messagesRef, messages, channel, user, progressBar, numUniqueUsers, 
            searchTerm, searchResult, searchLoading, privateChannel } = this.state;

        return (
            <React.Fragment>
                <MessagesHeader 
                channelName = {this.displayChannelName(channel)}
                numUniqueUsers={numUniqueUsers} 
                handleSearchChange={this.handleSearchChange}
                searchLoading={searchLoading}
                isPrivateChannel={privateChannel} />

                <Segment>
                    <Comment.Group className={progressBar ? 'messages__progress': 'messages' }>
                        {/*Messages*/}
                        {searchTerm ? this.displayMessages(searchResult) : this.displayMessages(messages)}
                        <div ref={node => (this.messageEnd = node)}>

                        </div>
                    </Comment.Group>
                </Segment>
                <MessageForm
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                    isProgressBarVisible={this.isProgressBarVisible}
                    isPrivateChannel={privateChannel}
                    getMessagesRef={this.getMessagesRef} />
            </React.Fragment>
        )
    }
}

export default connect(null, {setUserPosts})(Messages);