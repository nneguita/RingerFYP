import React from 'react';
import {Header, Segment, Input, Icon} from 'semantic-ui-react';

class MessagesHeader extends React.Component {
    render() {
        const {channelName, numUniqueUsers, handleSearchChange, searchLoading, isPrivateChannel} =this.props;

        return(
            <Segment clearing>
                {/*Channel Title*/}
                <Header fluid="true" as="h2" floated="left" style={{marginBottom: 0}}>
                    <span>
                    {channelName}
                    {!isPrivateChannel && <Icon />}
                    </span>
                    <Header.Subheader>
                        {numUniqueUsers}
                    </Header.Subheader>
                </Header>

                {/*Channel search input (Searching messages inside the channel*/}
                <Header floated="right">
                    <Input size="mini" 
                    loading={searchLoading}
                    onChange={handleSearchChange}
                    icon="search" name="SearchTerm" placeholder="Search Messages" />

                </Header>
            </Segment>

        )
    }
}

export default MessagesHeader;