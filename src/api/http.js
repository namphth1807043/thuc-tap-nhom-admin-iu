import axios from 'axios'
import httpBuilder from './httpBuilder'
// import {decorateLogoutWhenExpiredInterceptor} from '../utils/axios'

const baseClient = axios.create({
  baseURL: 'http://thuctapnhom.azurewebsites.net/api'
});


// decorateLogoutWhenExpiredInterceptor(baseClient)

export const httpClient = httpBuilder(baseClient)
