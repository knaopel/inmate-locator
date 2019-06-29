import { Component } from '@angular/core';
import ZumoProvider from '../../../datasources/zumo/1.0/zumo.service';

const InmatesSyncComponent = Component({
    selector: 'oc-inmates-sync',
    template: require('./templates/inmates-sync.embed.html'),
    inputs: ['ds']
}).Class({
    constructor: function () {
        this.syncTime = null;
    },
    ngOnInit: function () {
        const queryParams = {
            table: 'syncLog',
            orderBy: 'syncTime desc',
            maxResults: 1,
            filter: null
        };
        const ds = $.extend({}, this.ds);
        this.zumoSvc = new ZumoProvider(ds);
        this.zumoSvc.getData(queryParams, true).then(data => {
            if (data.count > 0) {
                this.syncTime = data.rows[0].syncTime;
            }
        });
    }
});

export default InmatesSyncComponent;