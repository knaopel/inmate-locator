import {
    DataService,
    DataResponse
} from 'oc/appFramework';

class ZumoApi {
    constructor(urlEndpoint, applicationKey) {
        this.url = urlEndpoint;
        this.appKey = applicationKey;
        this.noCache = true;
    }
    getItems(options) {
        return new Promise((resolve, reject) => {
            if (options.table) {
                var paramMap = new Map();
                paramMap.set('inlinecount', 'allpages');
                if (options.startAt) {
                    paramMap.set('skip', options.startAt);
                }
                if (options.maxResults) {
                    paramMap.set('top', options.maxResults)
                }
                if (options.filter) {
                    let regex = new RegExp(/(\[ThreeDaysAgo\])/);
                    if (regex.test(options.filter)) {
                        let daysAgo = new Date();
                        // daysAgo.setDate(new Date().getDate() -3);
                        daysAgo.setHours(daysAgo.getHours() - 72);
                        // reset to midnight UTC
                        daysAgo.setUTCHours(0);
                        daysAgo.setUTCMinutes(0);
                        daysAgo.setUTCSeconds(0);
                        options.filter = options.filter.replace(regex, daysAgo.toISOString());
                    }
                    paramMap.set('filter', options.filter)
                }
                if (options.orderBy) {
                    paramMap.set('orderby', options.orderBy)
                }
                this.apiRequest(options.table, paramMap)
                    .then(data => {
                        resolve(data);
                    }, err => {
                        reject(err);
                    });
            } else {
                reject("no table name provided!");
            }
        })
    }

    apiRequest(tableName, queryParamMap) {
        let params = [];
        for (let [key, val] of queryParamMap.entries()) {
            params.push(`$${key}=${val}`);
        }
        const queryString = `?${params.join('&')}`;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.url}/tables/${tableName.toLowerCase()}${queryString}`,
                headers: {
                    'X-ZUMO-APPLICATION': this.appKey
                }
            }).done((data, status, xhr) => {
                data.status = status;
                data.xhr = xhr;
                data.end = queryParamMap.get("top") || -1;
                data.start = queryParamMap.get("skip") || 0;
                data.filter = queryParamMap.get("filter") || null;
                resolve(data);
            });
        });
    }
}

class ZumoProvider extends DataService {
    constructor(config, mappings) {
        super(ZumoService, config, mappings, null);
    }
}

class ZumoService {
    constructor(datasource) {
        this.datasource = datasource;
        // console.log(ZumoApi);
        this.client = datasource.url && datasource.appKey ?
            new ZumoApi(datasource.url, datasource.appKey) :
            null;
    }

    getData(queryOpts = {}, usePromise) {
        const options = Object.assign({}, this.datasource, queryOpts);

        return new Promise((resolve, reject) => {
            const onSuccess = data => {
                resolve(new DataResponse({
                    rows: data.results,
                    count: data.count,
                    start: data.start || 0,
                    end: data.end
                }, data.status, data.xhr));
            };
            const onFailure = function (error) {
                reject(error);
                throw new Error('Error loading data: ', error);
            };
            if (usePromise) {
                if (this.client) {
                    this.client.getItems(options)
                        .then(onSuccess, onFailure);
                }
            } else {
                reject('Operation not supported');
            }
        });
    }
}

export default ZumoProvider;