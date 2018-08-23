import React from 'react';
import {
    Marker,
    InfoWindow,
} from 'react-google-maps';

export class AroundMarket extends React.Component {
    state = {
        isOpen: false,
    }
    onToggleOpen = ()=> {
        this.setState((prevState) => {
            return {
                isOpen: !prevState.isOpen,
            }
        } );
    }
    render () {
        return (
            <Marker
                position={this.props.position}
                onClick={this.onToggleOpen}
            >
                {this.state.isOpen ?
                    <InfoWindow onCloseClick={this.onToggleOpen}>
                        <div>Info Window</div>
                    </InfoWindow>: null
                }
            </Marker>
        )
    }
}