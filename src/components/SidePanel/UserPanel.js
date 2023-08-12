import React from 'react';
import firebase from '../../firebase';
import AvatarEditor from 'react-avatar-editor';
import { Grid, GridColumn, GridRow, Header, Icon, HeaderContent, Dropdown, Image, Modal, Input, Button } from 'semantic-ui-react';

class UserPanel extends React.Component { 
    state = {
        user: this.props.currentUser, //passed down from app
        modal:false,
        previewImage: '',
        croppedImage: '',
        blob: '',
        storageRef: firebase.storage().ref(),
        userRef: firebase.auth().currentUser,
        usersRef: firebase.database().ref('users'),
        uploadCroppedImage: '',
        metadata: {
            contentType: 'image/jpeg'
        }
    };

    openModal = () => this.setState({modal:true});
    closeModal = () => this.setState({modal:false})

    dropdownOptions = () => [ //dropdown choice
        {
            key:'user',
            text: <span>Signed In as <strong>{this.state.user.displayName}</strong></span>,
            disabled: true
        },
        {
            key:'avatar',
            text: <span onClick={this.openModal}>Change Avatar</span>
        },
        {
            key:'signout',
            text: <span onClick={this.handleSignOut}>Signed Out</span>
        }
    ];

    handleChange = event => {
        const file =event.target.files[0];
        const reader = new FileReader();

        if(file) {
            reader.readAsDataURL(file);
            reader.addEventListener('load', ()=> {
                this.setState({previewImage: reader.result});
            })
        }
    };

    handleCropImage =() =>{
        if(this.avatarEditor) {
            this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
                let imageUrl = URL.createObjectURL(blob);
                this.setState({
                    croppedImage: imageUrl,
                    blob
                })
            })
        }
    };

    uploadCroppedImage = () =>{
        const {storageRef, userRef, blob, metadata} =this.state;

        storageRef
            .child(`avatars/users-${userRef.uid}`)
            .put(blob, metadata )
            .then(snap => {
                snap.ref.getDownloadURL().then(downloadURL => {
                    this.setState({uploadCroppedImage: downloadURL}, () =>
                    this.changeAvatar()
                    )
                })
            })
    }

    changeAvatar = () => {
        this.state.userRef
            .updateProfile({
                photoURL:this.state.uploadCroppedImage
            })
            .then(()=> {
                console.log('PhotoURL updated');
                this.closeModal();
            })
            .catch(err =>{
                console.error(err);
            })

            this.state.usersRef
                .child(this.state.user.uid)
                .update({ avatar:this.state.uploadCroppedImage})
                .then(()=> {
                    console.log("User avatar updated")
                })
                .catch(err=> {
                    console.error(err);
                })
    }

    handleSignOut = () =>{
        firebase
            .auth()
            .signOut()
            .then(() => console.log('Signed Out!')) //to properly signed out
    }

    render() { //user panel layout
        const {user, modal, previewImage, croppedImage} = this.state;

        return (
            <Grid style ={{ background: '#8c1c5c'}}>
                <GridColumn>
                    <GridRow style ={{padding: '1.2em', margin: 0}}>
                        {/* App Header */}
                        <Header inverted floated= "left" as ="h2">
                            <Icon name='code branch' />
                            <HeaderContent>
                                Ringer
                            </HeaderContent>
                        </Header>
                        
                    {/* User Dropdown */}
                    <Header style ={{padding : '0.25em'}} as ="h4" inverted>
                        <Dropdown trigger={
                        <span>
                            <Image src={user.photoURL} spaced ="right" avatar />
                            {user.displayName}
                        </span>
                        } options ={this.dropdownOptions()}/>
                        </Header>
                    </GridRow>
                    {/*Change user avata modal*/}
                    <Modal basic open={modal} onClose={this.closeModal} >
                        <Modal.Header>
                            Change Avatar
                        </Modal.Header>
                        <Modal.Content>
                            <Input 
                            onChange={this.handleChange}
                            fluid
                            type="file"
                            label="new avatar"
                            name="previewImage" />
                            <Grid centered stackable columns={2}>
                                <Grid.Row centered>
                                    <Grid.Column className="ui center aligned grid">
                                        {/*Image preview*/}
                                        {previewImage && (
                                            <AvatarEditor image={previewImage}
                                            ref={node => (this.avatarEditor =node)}
                                            width={120}
                                            height={120}
                                            border={50}
                                            scale={1.2} />
                                        )}
                                    </Grid.Column>
                                    <Grid.Column className="ui center aligned grid">
                                        {/*Cropped Image preview*/}
                                        {croppedImage && (
                                            <Image style={{margin:'3.5em auto'}}
                                            width={100}
                                            height={100}
                                            src={croppedImage} />
                                        )}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Modal.Content>
                        <Modal.Actions>
                            {croppedImage && <Button color="green" inverted onClick={this.uploadCroppedImage} >
                                <Icon name="save" /> Change Avatar
                            </Button>}
                            <Button color="green" inverted onClick={this.handleCropImage} >
                                <Icon name="image" /> Preview
                            </Button>
                            <Button color="red" inverted onClick={this.closeModal}>
                                <Icon name="remove" /> Cancel
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </GridColumn>
            </Grid>
        );
    }
}

export default UserPanel;