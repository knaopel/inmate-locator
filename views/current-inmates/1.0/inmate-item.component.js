import { Component } from '@angular/core';

const InmateItemComponent = Component({
    selector: 'div.oc-inmate-item',
    styles: [
        require('./styles/inmate-item.embed.scss'),
        require('./styles/data-table-header.embed.scss')
    ],
    template: require('./templates/inmate-item.embed.html'),
    inputs: ['inmate', 'parentId', 'ds', 'isLast', 'showCharges', 'showLocation', 'showBond', 'showRelease', 'dateToShow']
}).Class({
    constructor: function () {
     },
    togglePanel: function (event) {
        const target = event.target;
        const icon = target.querySelector('i.fa');
        if (icon.classList.contains('fa-chevron-down')) {
            icon.className = 'fa fa-chevron-up';
            this.inmate.bondAmount = this.sumBondFromCharges(this.inmate.charges);
        } else {
            icon.className = 'fa fa-chevron-down';
        }
    },
    getItemId() {
        return `${this.parentId}_${this.inmate.id}`;
    },
    sumBondFromCharges: function (charges) {
        let bond = 0;
        for (let i = 0; i < charges.length; i++) {
            const bondAmount = charges[i].bondAmount
            if (bondAmount) {
                bond += bondAmount;
            }
        }
        return bond;
    }
});

export default InmateItemComponent;