import Axios from 'axios';

export class DirectoryApi {
  getDirectoryData(jsonName: any) {
    return Axios.get(
      `https://sitemap.insighttimer.com/json/${jsonName}.json`
    ).then(resp => {
      return resp.data;
    });
  }

  getDirectoryGMSData(jsonName: any) {
    return Axios.get(
      `https://sitemap.insighttimer.com/gms/${jsonName}.json`
    ).then(resp => {
      return resp.data;
    });
  }
}