import { Component, ViewChild, EventEmitter } from '@angular/core';

const InmatesPagingComponent = Component({
    selector: 'oc-inmates-paging',
    styles: ['.row { padding: 0.5em 0; } .text-center { padding: 6px 0; }'],
    template: require('./templates/inmates-paging.embed.html'),
    inputs: ['pagesize', 'first', 'total', 'loadComplete'],
    outputs: ['navigate', 'firstChange'],
    queries: {
        revIconRef: new ViewChild('revIcon'),
        fwdIconRef: new ViewChild('fwdIcon')
    }
}).Class({
    constructor: function () {
        this.first = 0;
        this.isLoading = false;
        this.navReverse = false;
        this.currentIcon = null;
        this.navigate = new EventEmitter();
        this.firstChange = new EventEmitter();
    },
    ngOnInit: function () {
        this.loadComplete.subscribe(_ => {
            this.hideLoading();
        });
    },
    // ngOnChanges: function (changeRecord) {
    //     console.log('changeRecord: ', changeRecord);
    //     console.log('first: ', this.first);
    // },
    onButtonClick: function (event, isReverse) {
        const pageCount = this.getPageCount();
        let page = this.getPage();
        this.currentIcon = event.currentTarget.querySelector('i');
        this.navReverse = isReverse;
        this.showLoading();
        if (isReverse) {
            page -= 1;
        } else {
            page += 1;
        }
        this.first = this.pagesize * page;
        const state = {
            page: page,
            first: this.first,
            // pagesize: this.pagesize,
            total: this.total,
            pageCount: pageCount
        };
        this.navigate.emit(state);
        this.firstChange.emit(this.first);
    },
    isFirstPage: function () {
        return this.getPage() === 0;
    },
    isLastPage: function () {
        return this.getPage() === this.getPageCount() - 1;
    },
    getPage: function () {
        if (!this.first) {
            this.first = 0;
        }
        return Math.floor(this.first / this.pagesize);
    },
    getPageCount: function () {
        return Math.ceil(this.total / this.pagesize);
    },
    showLoading: function () {
        if (!this.currentIcon) { return; }
        if (this.navReverse) {
            this.currentIcon.classList.remove('fa-chevron-left');
        } else {
            this.currentIcon.classList.remove('fa-chevron-right');
        }
        this.currentIcon.classList.add('fa-refresh');
        this.currentIcon.classList.add('fa-spin');
    },
    hideLoading: function () {
        [this.fwdIconRef, this.revIconRef].forEach(icon => {
            icon.nativeElement.classList.remove('fa-spin');
            icon.nativeElement.classList.remove('fa-refresh');
        });
        this.revIconRef.nativeElement.classList.add('fa-chevron-left');
        this.fwdIconRef.nativeElement.classList.add('fa-chevron-right');
    }
});

export default InmatesPagingComponent;