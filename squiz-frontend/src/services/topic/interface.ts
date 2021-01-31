export type Topic = {
  title: string;
  description: string;
  paragraph: string;
  id: string;
  related_topics: string[];
  type: string;
  name: string;
};

export interface TopicService {
  getTopicBySlug(topic: string): Promise<Topic>;
}
