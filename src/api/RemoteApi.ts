import * as axios from 'axios'
import {RemoteConstant} from './RemoteConstant'
import {isObject} from "util";




export default class RemoteApi {

  readonly URL_PREFIX:string = "/api"

  private toQueryString(paramsObject: any): string {
    return Object
      .keys(paramsObject)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(paramsObject[key])}`)
      .join('&')
  }

  private getFullURL(api: RemoteConstant, data?: any) : string {
    const apiURL = RemoteConstant[api].toLowerCase()
    let fullURL = `${this.URL_PREFIX}/${apiURL}`
    if(isObject(data)) {
      fullURL = `${fullURL}?${this.toQueryString(data)}`
    }
    return fullURL;
  }

  private get(fullURL:string) {
    return axios.get(fullURL)
  }

  getData(api: RemoteConstant, data?: any) {
    return this.get(this.getFullURL(api,data))
  }

}
