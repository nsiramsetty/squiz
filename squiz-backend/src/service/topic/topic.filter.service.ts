import * as lodash from 'lodash';
import path from 'path';
import { ParsedQs } from 'qs';
import { ResponseWrapperModel } from '../../model/response/response-wrapper.model';
import { SearchResultResponse } from '../../model/response/search-result.model';
import { TopicDetail, TopicGroupResponse } from '../../model/topic/topic.model';
import { Collection, SupportedLanguage } from '../../shared/enum';
import logger from '../../shared/logger';
import { getFirestoreDocById } from '../shared/firestore.service';

const log = logger(path.relative(process.cwd(), __filename));

export function combineRequestedLanguages(deviceLang: string, contentLang: string): string[] {
  let requestedLang: string[] = [];
  if (deviceLang) {
    const supportedLangCodes = Object.values(SupportedLanguage);
    const deviceLanguage = deviceLang as SupportedLanguage;
    if (supportedLangCodes.indexOf(deviceLanguage) < 0) {
      requestedLang.push('en');
    } else {
      requestedLang.push(deviceLang);
    }
  }

  if (contentLang && contentLang.trim() !== '') {
    contentLang
      .split(',')
      .filter((l): boolean => l.trim() !== '')
      .map((l): string => l.trim())
      .forEach((l): number => requestedLang.push(l));
  }
  requestedLang = lodash.uniq(requestedLang);

  if (requestedLang.length === 0) {
    requestedLang.push('en');
  }
  return requestedLang;
}

function processChildTags(
  topicTemp: TopicDetail,
  tagGroups: TopicGroupResponse[],
  tagGroupIndex: number,
  tagIndex: number,
): void {
  const topic = topicTemp;
  if (topic.children && topic.children.length > 0) {
    for (let childIndex = 0; childIndex < topic.children.length; childIndex += 1) {
      const child = topic.children[childIndex];
      for (let otherTagGroupIndex = 1; otherTagGroupIndex < tagGroups.length; otherTagGroupIndex += 1) {
        const otherLevel1 = tagGroups[otherTagGroupIndex].topic_groups[tagGroupIndex];
        delete child.id;
        if (child.count_library_items <= 0) {
          const otherChildren = otherLevel1.topics[tagIndex].children;
          if (
            otherChildren &&
            otherChildren.length > 0 &&
            otherChildren[childIndex].topic === child.topic &&
            otherChildren[childIndex].count_library_items > 0
          ) {
            child.count_library_items = otherChildren[childIndex].count_library_items;
            break;
          }
        }
      }
      topic.children = topic.children.filter((c: TopicDetail): boolean => c.count_library_items > 0);
    }
  }
}

export function mergeTopicGroups(topicGroups: TopicGroupResponse[], noChildren: boolean = false): void {
  for (let index = 0; index < topicGroups.length; index += 1) {
    const result: TopicGroupResponse = topicGroups[index];

    for (let indexInTopicGroup = 0; indexInTopicGroup < result.topic_groups.length; indexInTopicGroup += 1) {
      const level1 = result.topic_groups[indexInTopicGroup];
      try {
        if (level1.topics) {
          for (let topicIndex = 0; topicIndex < level1.topics.length; topicIndex += 1) {
            const topic = level1.topics[topicIndex];
            topic.id = `${topic.topic}-${result.id}`;
            topic.children.map(
              (childTopic: TopicDetail): TopicDetail => {
                const childTopicClone = childTopic;
                childTopicClone.id = `${childTopicClone.topic}-${result.id}`;
                return childTopicClone;
              },
            );
            if (topic.count_library_items <= 0) {
              for (let otherTopicGroupIndex = 1; otherTopicGroupIndex < topicGroups.length; otherTopicGroupIndex += 1) {
                const otherLevel1 = topicGroups[otherTopicGroupIndex].topic_groups[indexInTopicGroup];
                if (
                  otherLevel1.topics.length > 0 &&
                  otherLevel1.topics[topicIndex] &&
                  otherLevel1.topics[topicIndex].topic === topic.topic
                ) {
                  if (otherLevel1.topics[topicIndex].count_library_items > 0) {
                    topic.count_library_items = otherLevel1.topics[topicIndex].count_library_items;
                    break;
                  }
                }
              }
            }
            processChildTags(topic, topicGroups, indexInTopicGroup, topicIndex);
          }
          if (level1.topics.length > 0) {
            level1.topics = level1.topics
              .filter((t: TopicDetail): boolean => (t.children && t.children.length > 0) || t.count_library_items > 0)
              .map(
                (t: TopicDetail): TopicDetail => {
                  const topic = t;
                  if (noChildren) {
                    delete topic.children;
                  }
                  return topic;
                },
              );
          }
        }
      } catch (error) {
        log.error(`mergeTopicGroups :: error :${JSON.stringify(error)}`);
        throw error;
      }
    }
  }
}

export async function getTopicFilterResultsFromFS(queryParams: ParsedQs): Promise<TopicGroupResponse[]> {
  const requestedLanguages = combineRequestedLanguages(
    queryParams.device_lang?.toString().trim(),
    queryParams.content_lang?.toString().trim(),
  );

  const promises: Promise<SearchResultResponse>[] = [];
  const documentPath = `${Collection.COMPANY_CONTENT_MAP}/${Collection.TOPICS}/lang`;

  requestedLanguages.forEach((lang: string): void => {
    promises.push(getFirestoreDocById(documentPath, lang));
  });

  const res = await Promise.all(promises).then((result): TopicGroupResponse[] => {
    return result.length
      ? result
          .map(
            (r: SearchResultResponse): TopicGroupResponse => {
              const data: TopicGroupResponse = r as TopicGroupResponse;
              if (data) {
                data.id = r.id;
              }
              return data;
            },
          )
          .filter((d): boolean => !!d)
      : [];
  });
  mergeTopicGroups(res);
  return res;
}

export async function filterTopics(queryParams: ParsedQs): Promise<ResponseWrapperModel<TopicGroupResponse>> {
  const resultsFromES = await getTopicFilterResultsFromFS(queryParams);
  return { total: resultsFromES.length, items: resultsFromES };
}
