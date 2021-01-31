"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GROUP_RELATION_SUMMARY_FIELDS = exports.GROUP_SUMMARY_TOP_VIEW_FIELDS = exports.GROUP_SUMMARY_FIELDS = void 0;
exports.GROUP_SUMMARY_FIELDS = [
    'id',
    'admins.name',
    'admins.id',
    'created_at',
    'created_by',
    'created_by_device_lang',
    'name',
    'long_description',
    'type',
    'member_count',
    'privacy_type',
    'privacy_hidden',
    'welcome_message',
    'updated_at',
    'updated_by',
    'background',
    'is_deleted',
    'email_domains',
];
exports.GROUP_SUMMARY_TOP_VIEW_FIELDS = ['id', 'background', 'name', 'type', 'privacy_type', 'member_count'];
exports.GROUP_RELATION_SUMMARY_FIELDS = ['group_summary', 'has_joined', 'joined_at', 'is_private'];
//# sourceMappingURL=group.model.js.map