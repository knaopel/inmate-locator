import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppModule } from 'oc/angular';

const ZumoConfigComponent = Component({
    selector: 'zumo-config',
    styles: [],
    template: require('./templates/zumo-config.embed.html')
}).Class({
    constructor: function () { }
});

const ZumoConfigModule = new AppModule(ZumoConfigComponent, {
    imports: [FormsModule]
});

export default ZumoConfigModule;