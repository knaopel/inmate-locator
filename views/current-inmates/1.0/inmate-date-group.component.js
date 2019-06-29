import { Component } from '@angular/core';

const InmateDateGroupComponent = Component({
    selector: 'oc-inmate-date-group',
    template: `
    <div class="panel panel-info">
        <div class="panel-heading">
            <h3 class="panel-title"><span class="action">{{action}}</span> on {{group.date|date}}</h3>
        </div>
    </div>
    <ng-content></ng-content>
    `,
    styles: [require('./styles/inmate-date-group.embed.scss')],
    inputs: ['group', 'action']
}).Class({
    constructor: function () { }
});

export default InmateDateGroupComponent;