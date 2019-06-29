# Inmate Locator
Code sample from larger proprietary project for displaying inmate population from county jail using Angular 4 and Azure App Service Mobile App

## Technologies
This is an [Angular 4](https://angular.io) Application written in [ES6](http://es6-features.org/), using [Bootstrap](https://getbootstrap.com) for styling and connecting to a [Microsoft Azure](https://azure.microsoft.com) [App Service - Mobile App](https://docs.microsoft.com/en-us/azure/app-service-mobile/) service to retrive the data.

## Example
You can see the application at: [Oakland County, Michigan Sheriff's Inmate Locator](https://www.oakgov.com/sheriff/Corrections-Courts/Inmate-Locator/Pages/Inmates-Released.aspx)

## Related
Synchronozation of data is managed by [Microsoft® SQL Server Integration Services 2012](https://www.microsoft.com/en-us/download/details.aspx?id=36843) with a custom destination component at [OakGov.Etl.ZumoDestination](https://github.com/knaopel/OakGov.Etl.ZumoDestination)