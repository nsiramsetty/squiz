import moment from 'moment';
import { Course, Review } from 'services/courses';
import { getCoursePrice } from 'services/courses/helpers';
import {
  getLibraryItemImageUrl,
  getLibraryItemPreviewAudioUrl
} from 'services/media';
import { LibraryItem } from 'services/singles';

export const generateReviews = (reviews: Review[]) => {
  return reviews.map(review => {
    return {
      '@type': 'Review',
      author: review.owner.name,
      datePublished: moment(review.rated_at.epoch).format('YYYY-MM-DD'),
      description: review.message,
      reviewRating: {
        '@type': 'Rating',
        bestRating: '5',
        ratingValue: review.rating,
        worstRating: '1'
      }
    };
  });
};

export const generateCourseList = (course: Course, slug: string) => {
  return course.course_days.map((courseDay: any, index: number) => {
    return {
      '@type': 'ListItem',
      position: courseDay.day,
      item: {
        '@type': 'Course',
        url: `https://insighttimer.com/meditation-courses/${slug}#${index}`,
        name: courseDay.title,
        author: {
          '@type': 'Person',
          name: course.publisher.name
        },
        // ...(course.created_at !== undefined && {
        //   datePublished: course.
        // }),
        description: courseDay.outline,
        provider: 'Insight Timer'
      }
    };
  });
};

export const generateProductByCourse = (course: Course, slug: string) => {
  return {
    '@type': 'Product',
    name: course.title,
    image: getLibraryItemImageUrl(course.id, 'square', 'medium'),
    description: course.long_description,
    mpn: course.id,
    sku: course.id,
    category: 'Meditation Courses',
    brand: {
      '@type': 'Brand',
      name: 'Meditation Courses | Insight Timer'
    },
    owner: {
      '@type': 'Person',
      name: course.publisher.name
    },
    aggregateRating: course.rating_score
      ? {
          '@type': 'AggregateRating',
          ratingValue: course.rating_score,
          reviewCount: course.rating_count,
          worstRating: '1',
          bestRating: '5'
        }
      : undefined,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/OnlineOnly',
      price: getCoursePrice(course),
      priceCurrency: 'USD',
      url: `https://insighttimer.com/meditation-courses/${slug}`
    }
  };
};

export const generateAudioObject = (libraryItem: LibraryItem) => {
  return {
    '@type': 'AudioObject',
    contentUrl: getLibraryItemPreviewAudioUrl(libraryItem.id),
    description: libraryItem.long_description,
    duration: moment.duration(libraryItem.media_length, 's').toISOString(),
    encodingFormat: 'audio/mpeg',
    name: libraryItem.title
  };
};

export const generateVideoObject = (libraryItem: LibraryItem, slug: string) => {
  return {
    '@type': 'VideoObject',
    name: libraryItem.title,
    description: libraryItem.long_description,
    thumbnailUrl: getLibraryItemImageUrl(libraryItem.id, 'rectangle', 'medium'),
    '@id': libraryItem.id,
    contentUrl: `https://insighttimer.com/${libraryItem.publisher.username}/guided-meditations/${slug}`,
    duration: moment.duration(libraryItem.media_length, 's').toISOString(),
    ...(libraryItem.created_at.epoch !== undefined && {
      uploadDate: moment(libraryItem.created_at.epoch)
        .toDate()
        .toISOString()
    }),
    author: {
      '@type': 'Person',
      name: libraryItem.publisher.name
    },
    interactionStatistic: [
      {
        '@type': 'InteractionCounter',
        interactionType: 'http://schema.org/WatchAction',
        userInteractionCount: libraryItem.play_count
      }
    ]
  };
};

export const generateProductByLibraryItem = (libraryItem: LibraryItem) => {
  return {
    '@type': 'Product',
    name: libraryItem.title,
    image: getLibraryItemImageUrl(libraryItem.id, 'rectangle', 'large'),
    description: libraryItem.long_description,
    mpn: libraryItem.id,
    sku: libraryItem.id,
    category: 'Guided Meditation',
    brand: {
      '@type': 'Person',
      name: libraryItem.publisher.name
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: libraryItem.rating_score,
      reviewCount: libraryItem.rating_count,
      worstRating: '1',
      bestRating: '5'
    }
  };
};
