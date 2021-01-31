import Axios from 'axios';
import { BeginnerKitService, BeginnerKit } from './interface';
import { HOST_URL } from '../../Config/constants';

interface LooseObject {
  [key: string]: any;
}

function convert(obj: LooseObject): BeginnerKit {
  return {
    title_top: '',
    title_bottom: '',
    background_image: obj.picture_square.large
  } as BeginnerKit;
}

export class BeginnerKitApi implements BeginnerKitService {
  getBeginnerKits(lang: string): Promise<BeginnerKit[]> {
    return Axios.get(`${HOST_URL}/apiBeginnerKitGet/request/All`).then(resp =>
      (resp.data as []).map(val => convert(val))
    );
  }
}
