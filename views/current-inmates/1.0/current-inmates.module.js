import { Component, ViewChild, ViewContainerRef, EventEmitter } from '@angular/core';
import { AppModule } from 'oc/angular';
import { Generate } from 'oc/utilities';
import { CurrencyZeroAsDashPipe, DateTimeAgnosticTimePipe, TimeZoneAbbreviatorPipe, TitleCasePipe } from 'oc/ng/pipes';
import { TimeAgoPipe } from 'time-ago-pipe';

import { DataTableModule } from 'primeng/components/datatable/datatable';
import SearchBoxModule from 'oc/ng/modules/search-box';
import SelectButtonModule from 'oc/ng/modules/select-button';

import InmateDateGroupComponent from './inmate-date-group.component';
import InmateItemComponent from './inmate-item.component';
import InmatesToggleComponent from './inmates-toggle.component';
import InmateHoldsComponent from './inmate-holds.component';
import InmatesPagingComponent from './inmates-paging.component';
import InmatesSyncComponent from './inmates-sync.component';


const CurrentInmatesComponent = Component({
    selector: 'oc-inmates-current',
    styles: [require('./styles/current-inmates.embed.scss')],
    template: require('./templates/current-inmates.embed.html'),
    outputs: ['onLoadComplete'],
    queries: {
        inmateList: new ViewChild('inmateList', { 'read': ViewContainerRef })
    }
}).Class({
    constructor: function () {

        const guid = Generate.newUUID();
        this.widgetId = `accordion_${guid}`;
        this.baseFilter = null;
        this.filter = null;
        this.scopes = [];
        this.onLoadComplete = new EventEmitter();
    },
    ngOnInit: function () {
        this.reportType = this.app.info.viewConfig.reportType;
        this.dtToGrp = this.reportType === 'b' ? 'booked' : 'released';
        this.dateColName = this.dtToGrp === 'booked' ? 'bookedDate' : 'releaseDate';
        this.scopes = [
            {
                label: 'Name',
                value: `${this.dateColName} desc,lastName,firstName`,
                icon: 'font'
            },
            {
                label: 'Date',
                value: `${this.dtToGrp} desc`,
                icon: 'calendar'
            }
        ]
        if (this.info.data.rows) {
            this.parseData(this.info.data);
        } else {
            this.app.onDataLoaded.subscribe(() => {
                this.parseData(this.info.data);
            });
        }
    },
    parseData: function (data) {
        if (this.reportType === 'r' || this.reportType === 'b') {
            this.info.data = data;
            this.info.data.rows = this.groupByDate(data.rows, this.dateColName);

        } else {
            this.info.data = data;
        }
    },
    groupByDate: function (rows, fieldToGroup) {
        let groups = [], grpIdx = -1, dt;
        rows.forEach(row => {
            var rowDate = row[fieldToGroup];
            if (dt !== rowDate) {
                // new group
                ++grpIdx;
                dt = rowDate;
                groups[grpIdx] = {
                    date: rowDate,
                    rows: [row]
                };
            } else {
                // add to previous group
                groups[grpIdx].rows.push(row);
            }
        });
        return groups;
    },
    onSortToggle: function (event) {
        // event.queryType = QueryType.OrderBy;
        // console.log('CurrentInmatesComponent.onSortToggle()', event);
        this.first = 0;
        this.sortBy = event.value;
        this.onIssueSearch(event);
    },
    onNavigate: function (event) {
        // event.queryType = QueryType.Paging;
        this.onIssueSearch(event);
    },
    onSearch: function (query) {
        if (this.query != query) {
            this.query = query;
            this.first = 0;
            this.onIssueSearch({
                // queryType: QueryType.Search
            });
        }
    },
    onIssueSearch: function (event) {
        this.showLoading();
        // debugger;
        // switch (event.queryType) {
        //     case QueryType.Search:
        //         // if (this.query === '') {
        //         //     this.info.data = this.cachedData;
        //         //     return;
        //         // } else {
        //         // }
        //         break;
        //     case QueryType.OrderBy:

        //         break;
        //     case QueryType.Paging:
        //         break;
        // }
        const ds = $.extend({}, this.app.dataSvc.config);

        if (!this.baseFilter) {
            this.baseFilter = ds.filter;
        }

        if (!this.sortBy) {
            this.sortBy = ds.orderBy;
        }

        const queryOptions = {
            filter: this.query ? `${this.baseFilter} and (startswith(firstName, '${this.query}') or startswith(lastName, '${this.query}'))` : this.baseFilter,
            orderBy: this.sortBy ? this.sortBy : null,
            startAt: event.first || 0
        };

        this.app.dataSvc.getData(queryOptions, true).then(data => {
            this.parseData(data);
            this.onLoadComplete.emit(true);
            this.hideLoading();
        });
    },
    getItemId(index) {
        return `${this.widgetId}_${index}`;
    },
    getInmateItemClass: function (inmateItem, showCharges, isLast) {
        let classes = ['oc-inmate-item', 'panel'];
        if (showCharges && inmateItem.activeHolds) {
            classes.push('panel-primary');
        } else {
            classes.push('panel-default');
        }
        if (isLast) {
            classes.push('last');
        }

        return classes.join(' ');
    },
    showLoading() {
        if (this.inmateList) {
            this.inmateList.element.nativeElement.classList.remove('loaded');
        }
    },
    hideLoading() {
        if (this.inmateList) {
            this.inmateList.element.nativeElement.classList.add('loaded');
        }
    }
});

const CurrentInmatesModule = new AppModule(CurrentInmatesComponent, {
    declarations: [
        InmateDateGroupComponent,
        InmatesToggleComponent,
        InmateItemComponent,
        InmateHoldsComponent,
        InmatesPagingComponent,
        InmatesSyncComponent,
        CurrencyZeroAsDashPipe,
        DateTimeAgnosticTimePipe,
        TimeZoneAbbreviatorPipe,
        TitleCasePipe,
        TimeAgoPipe
    ],
    imports: [
        DataTableModule,
        SearchBoxModule,
        SelectButtonModule
    ],
    exports: [CurrentInmatesComponent]
});

export default CurrentInmatesModule;