"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_RELATION_SUMMARY_FIELDS = exports.PUBLISHER_SUMMARY_FIELDS = exports.USER_SUMMARY_TOP_VIEW_FIELDS = exports.USER_SUMMARY_FIELDS = void 0;
exports.USER_SUMMARY_FIELDS = [
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
exports.USER_SUMMARY_TOP_VIEW_FIELDS = [
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
exports.PUBLISHER_SUMMARY_FIELDS = [...exports.USER_SUMMARY_TOP_VIEW_FIELDS, 'is_publisher', 'number_of_followers'];
exports.USER_RELATION_SUMMARY_FIELDS = ['is_followed_by', 'is_following', 'is_friend', 'user'];
//# sourceMappingURL=user.model.js.map