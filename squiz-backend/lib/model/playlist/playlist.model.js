"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLAYLIST_DETAIL_FIELDS = exports.PLAYLIST_SUMMARY_TOP_VIEW_FIELDS = exports.PLAYLIST_SUMMARY_FIELDS = void 0;
exports.PLAYLIST_SUMMARY_FIELDS = [
    'id',
    'cover_image_library_item_id',
    'title',
    'is_private',
    'owner.username',
    'owner.id',
    'owner.name',
    'owner.milestone',
    'owner.has_avatar',
    'owner.region.name',
    'hashtags',
    'number_of_library_items',
    'created_at',
];
exports.PLAYLIST_SUMMARY_TOP_VIEW_FIELDS = [
    'id',
    'cover_image_library_item_id',
    'title',
    'is_private',
    'owner.id',
    'owner.name',
];
exports.PLAYLIST_DETAIL_FIELDS = [
    'id',
    'owner',
    'cover_image_library_item_id',
    'title',
    'is_private',
    'whitelisted_users',
    'description',
    'hashtags',
    'number_of_library_items',
];
//# sourceMappingURL=playlist.model.js.map