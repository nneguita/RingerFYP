/*import React from 'react';
import {Menu, Icon} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {setCurrentChannel, setPrivateChannel} from '../../actions';

class Starred extends React.Component {
    state = {
        starredChannels: [],
        activeChannel: ''
    }

    changeChannel = channel => {
        this.setActiveChannel(channel);
        this.clearNotifications();
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
    };

    displayChannels = starredChannels => (
        starredChannels.length > 0 && starredChannels.map(channel => (
            <Menu.Item
            key = {channel.id}
            onClick={() => this.changeChannel(channel)}
            name ={channel.name}
            style={{opacity:0.7}}
            active={channel.id === this.state.activeChannel}>
            #{channel.name}
            </Menu.Item>
        ))
    )

    setActiveChannel = channel => {
        this.setState({activeChannel: channel.id});
    };


    render() {
        const {starredChannels} = this.state;

        return (
            <Menu.Menu className="menu">
                <Menu.Item>
                    <span>
                        <Icon name="star" /> STARRED
                    </span> {''}
                    ({starredChannels.length}) 
                </Menu.Item>
                {/* Channels  } 
                {this.displayChannels(starredChannels)}
            </Menu.Menu>
        )
    }
}

export default connect(null, {setCurrentChannel, setPrivateChannel})(Starred);*/