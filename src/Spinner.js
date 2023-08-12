import React from 'react';
import {Loader, Dimmer} from 'semantic-ui-react';

const Spinner = () => (
    <Dimmer active>
        <Loader sixe="huge" content = {"Getting you parsed in..."}/>
    </Dimmer>
)

export default Spinner;