import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppModule } from 'oc/angular';

class ReportType {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

const CurrentInmatesConfigComponent = Component({
    selector: 'current-inmates-config',
    styles: [],
    template: require('./templates/current-inmates-config.embed.html')
}).Class({
    constructor: function () {
        this.reportTypes = [
            new ReportType('b', 'Booked'),
            new ReportType('r', 'Released'),
            new ReportType('c', 'Current')
        ];
    }
});

const CurrentInmatesConfigModule = new AppModule(CurrentInmatesConfigComponent, {
    imports: [FormsModule]
});

export default CurrentInmatesConfigModule;