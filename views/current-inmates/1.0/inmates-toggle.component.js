import { Component, EventEmitter } from '@angular/core';

const InmatesToggleComponent = Component({
    selector: 'oc-inmates-toggle',
    template: require('./templates/inmates-toggle.embed.html'),
    inputs: ['scopes', 'scope'],
    outputs: ['toggle']
}).Class({
    constructor: function () {
        this.toggle = new EventEmitter();
        // default values - will be overidden if inputs have value
        this.scope = 'lastName,firstName';
        this.scopes = [
            {
                label: 'Name',
                value: 'lastName,firstName',
                icon: 'font'
            },
            {
                label: 'Date',
                value: 'booked desc',
                icon: 'calendar'
            }
        ];
    },
    onSortChange: function (event) {
        // console.log('InmatesToggleComponent.onSortChange()', event);
        this.toggle.emit(event);
    }
})

export default InmatesToggleComponent;