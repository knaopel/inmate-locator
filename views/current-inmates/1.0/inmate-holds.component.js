import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import ZumoProvider from '../../../datasources/zumo/1.0/zumo.service';

const InmateHoldsComponent = Component({
    selector: 'oc-inmate-holds',
    styles: [
        require('./styles/data-table-header.embed.scss'),
        `
        :host ::ng-deep .spin-wrapper { text-align: center; }
        :host ::ng-deep .hide { display: none; }
        `
    ],
    template: require('./templates/inmate-holds.embed.html'),
    inputs: ['inmateId', 'parentId', 'ds'],
    queries: {
        panelbody: new ViewChild('panelbody', { 'read': ViewContainerRef })
    }
}).Class({
    constructor: function () {
        this.holds = [];
        this.zumoSvc = {};
    },
    ngOnInit: function () {
        const ds = {
            url: this.ds.url,
            appKey: this.ds.appKey,
            table: 'holds',
            filter: `inmateId eq '${this.inmateId}'`
        };
        this.zumoSvc = new ZumoProvider(ds);
    },
    loadData: function (event) {
        const target = event.target;
        const icon = target.querySelector('i.fa');
        const body = this.panelbody.element.nativeElement;
        const dataTable = body.querySelector('p-dataTable');
        const spinner = this.getSpinner();
        if (icon.classList.contains('fa-chevron-down')) {
            icon.className = 'fa fa-chevron-up';
            if (!(this.holds && this.holds.length)) {
                // only if we haven't already fetched the holds
                if (!body.querySelector('div.spin-wrapper')) {
                    body.appendChild(spinner);
                } else {
                    spinner.classList.remove('hide');
                }
                dataTable.classList.add('hide');
                this.zumoSvc.getData(null, true).then(data => {
                    this.holds = data.rows;
                    dataTable.classList.remove('hide');
                    body.querySelector('div.spin-wrapper').classList.add('hide');
                });
            }
        } else {
            icon.className = 'fa fa-chevron-down';
            // dataTable.hidden = false;
        }

    },
    getItemId() {
        return `${this.parentId}_${this.inmate.id}`;
    },
    getSpinner() {
        const wrapper = document.createElement('div');
        wrapper.className = 'spin-wrapper';

        const spinner = document.createElement('i');
        spinner.className = 'fa fa-refresh fa-spin fa-3x fa-fw';

        const loading = document.createElement('span');
        loading.className = 'sr-only';
        loading.innerText = 'Loading...';

        wrapper.append(spinner, loading);

        return wrapper;
    }
});

export default InmateHoldsComponent;