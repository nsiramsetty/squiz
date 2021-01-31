import { SearchResultType } from '../../shared/enum';

export interface UserResponse {
  id: string;
  name?: string;
  avatar?: string;
  is_publisher?: boolean;
  publisher_follower_count?: number;
  username?: string;
  search_result_type: SearchResultType;
  region?: {
    name?: string;
    location?: {
      lon?: number;
      lat?: number;
    };
  };
  is_friend?: boolean;
  is_friend_of_friend?: boolean;
  mutual_friends?: string[];
  is_following?: boolean;
  friends_who_are_following?: string[];
}

export interface UserRelationResponse {
  id: string;
  followings?: string[];
  friends?: string[];
  followers?: string[];
  groups?: string[];
}

export interface UserResponseMYSQL {
  id: string;
  is_publisher: boolean;
  region_name: string;
  username: string;
  milestone: string;
  number_of_followers: number;
  has_avatar: boolean;
  name: string;
  friend_name: string;
  is_following: boolean;
  is_friend: boolean;
}

export interface PublisherGratitudeComment {
  id?: string;
  search_result_type: SearchResultType;
  author?: {
    id?: string;
    avatar?: {
      small?: string;
      medium?: string;
    };
  };
}

export const USER_SUMMARY_FIELDS = [
  'aws_synced_at',
  'created_at',
  'description',
  'experience_level',
  'has_avatar',
  'id',
  'is_admin',
  'is_private',
  'is_publisher',
  'milestone',
  'name',
  'number_of_followers',
  'number_of_friends',
  'number_of_groups',
  'number_of_publisher_followings',
  'public_url',
  'publisher_description',
  'publisher_follower_count',
  'publisher_play_count',
  'region',
  'synced_at',
  'tagline',
  'updated_at',
  'username',
];

export const USER_SUMMARY_TOP_VIEW_FIELDS = [
  'region.name',
  'name',
  'username',
  'id',
  'milestone',
  'has_avatar',
  'is_friend',
  'is_friend_of_friend',
  'mutual_friends',
];

export const PUBLISHER_SUMMARY_FIELDS = [...USER_SUMMARY_TOP_VIEW_FIELDS, 'is_publisher', 'number_of_followers'];

export const USER_RELATION_SUMMARY_FIELDS = ['is_followed_by', 'is_following', 'is_friend', 'user'];

export interface UserRelationMutualFriendsResponse {
  friends: string[];
  friendsOfFriends: string[];
  mutualFriends: Map<string, string[] | undefined>;
}

export interface PublisherRelationMutualFriendsResponse {
  followings: string[];
  followingFriendsMap: Map<string, string[] | undefined>;
}

export interface UserRelationMySql {
  name?: string;
  user_id: string;
  other_user_id: string;
  is_friend?: boolean;
  friend_id?: string;
  friend_name?: string;
}
