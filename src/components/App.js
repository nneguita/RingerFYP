import React from 'react';
import {Grid, GridColumn} from 'semantic-ui-react';
import './App.css';
import {connect} from 'react-redux';

//import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';

 
const App = ({currentUser, currentChannel, isPrivateChannel, userPosts}) => (
<Grid columns = "equal" className="app" style ={{ background: '#3399cc'}}>
  {/*<ColorPanel />*/}
  <SidePanel key={currentUser && currentUser.uid} currentUser={currentUser}/>
  
  <GridColumn style ={{marginLeft: 320}}>
    <Messages key={currentChannel && currentChannel.id} 
    currentChannel={currentChannel}
    currentUser={currentUser}
    isPrivateChannel={isPrivateChannel} />
  </GridColumn>

  <GridColumn width={4}>
    <MetaPanel key={currentChannel && currentChannel.id}
    userPosts={userPosts}
    currentChannel={currentChannel}
    isPrivateChannel={isPrivateChannel} />
  </GridColumn>
</Grid>
);

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
  userPosts: state.channel.userPosts
});
 
//to run the program
export default connect(mapStateToProps)(App);
