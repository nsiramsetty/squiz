import Axios from 'axios';
import { TopicService, Topic } from './interface';
import { HOST_URL } from '../../Config/constants';

export class TopicApi implements TopicService {
  getTopicBySlug(topic: string): Promise<Topic> {
    return Axios.get(
      `${HOST_URL}/apiTopicFetch/request/web?device_lang=en&topic=${topic}&content_langs=en`
    ).then(resp => {
      return {
        title:
          (resp.data.custom_data && resp.data.custom_data.title) ||
          resp.data.short_description,
        description:
          (resp.data.custom_data && resp.data.custom_data.description) ||
          resp.data.long_description,
        paragraph:
          (resp.data.custom_data && resp.data.custom_data.paragraph) ||
          resp.data.long_description,
        id: resp.data.topic,
        related_topics: resp.data.related_topics,
        type: resp.data.type,
        name: resp.data.name
      };
    });
  }
}
