import axios from 'axios'
import httpBuilder from './httpBuilder'
// import {decorateLogoutWhenExpiredInterceptor} from '../utils/axios'

const baseClient = axios.create({
  baseURL: 'https://localhost:44321/api'
});


// decorateLogoutWhenExpiredInterceptor(baseClient)

export const httpClient = httpBuilder(baseClient)
