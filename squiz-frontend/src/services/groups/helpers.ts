import {
  BackgroundType,
  Group,
  GroupRelation,
  GroupSummary,
  UserSummary
} from '.';

export function isPrivate(group?: Group | GroupSummary) {
  if (group == null) return undefined;

  return group.privacy_type === 'PRIVATE';
}

export function isEnterprise(group: GroupSummary) {
  return group.type === 'ENTERPRISE';
}

export function getEmailDomain(group: GroupSummary) {
  return group.email_domains && group.email_domains[0];
}

export function isInvited(groupRelation?: GroupRelation) {
  if (groupRelation == null) return false;

  return groupRelation.is_invited === true;
}

export function getMemberStatus(groupRelation: GroupRelation) {
  if (groupRelation.is_approved === true) return 'MEMBER';

  if (groupRelation.is_approved === false) return 'PENDING';

  return undefined;
}

export function isMember(groupRelation?: GroupRelation) {
  if (groupRelation == null) return false;

  return groupRelation.is_approved === true;
}

export function isPendingApproval(groupRelation?: GroupRelation) {
  if (groupRelation == null) return undefined;

  return groupRelation.is_approved === false;
}

export function getMemberAvatarUrl(group_member: UserSummary) {
  const { has_avatar } = group_member;
  if (has_avatar) {
    return `${process.env.REACT_APP_PUBLISHER_IMAGE!}/${
      group_member.id
    }%2Fpictures%2Fsquare_small.jpeg?alt=media`;
  }

  return undefined;
}

function getGroupBackgroundCuratedImageUrl(background_preset_image?: string) {
  if (background_preset_image == null) return undefined;

  // TODO: Use small version if available in future
  // return `https://curated-images.insighttimer-api.net/${background_preset_image}/${size}.jpeg`;
  return `https://curated-images.insighttimer-api.net/${background_preset_image}/large.jpeg`;
}

export function getGroupHost(group: Group | GroupSummary) {
  return group.admins[0];
}

export function getGroupMembers(group?: GroupSummary) {
  if (group == null) return [];
  const { _selected_group_members: members } = group;
  return members || [];
}

type GroupBackgroundType =
  | {
      type: Extract<BackgroundType, 'CURATED_IMAGE' | 'PROFILE_IMAGE'>;
      src?: string;
    }
  | {
      type: Extract<BackgroundType, 'COLOUR_SOLID'>;
      backgroundCSS: string;
    }
  | {
      type: Extract<BackgroundType, 'COLOUR_GRADIENT'>;
      backgroundImageCSS: string;
    };

export function getGroupBackground(
  group: GroupSummary
): GroupBackgroundType | undefined {
  const {
    background_preset_image,
    background_colour_solid,
    background_colour_gradient,
    type
  } = group.background;
  const host = getGroupHost(group);
  const profileImageUrl = getMemberAvatarUrl(host);
  const curatedImageUrl = getGroupBackgroundCuratedImageUrl(
    background_preset_image
  );

  switch (type) {
    case 'CURATED_IMAGE':
      return {
        type,
        src: curatedImageUrl
      };
    case 'PROFILE_IMAGE':
      return {
        type,
        src: profileImageUrl
      };
    case 'COLOUR_SOLID':
      return {
        type,
        backgroundCSS:
          background_colour_solid != null
            ? `#${background_colour_solid}`
            : '#333333'
      };
    case 'COLOUR_GRADIENT':
      switch (background_colour_gradient?.gradient_direction) {
        case 'ltr':
          return {
            type,
            backgroundImageCSS: `linear-gradient(to right, #${background_colour_gradient?.gradient_from}, #${background_colour_gradient?.gradient_to})`
          };
        case 'rtl':
          return {
            type,
            backgroundImageCSS: `linear-gradient(to left, #${background_colour_gradient?.gradient_from}, #${background_colour_gradient?.gradient_to})`
          };
        default:
          return {
            type,
            backgroundImageCSS: `background-gradient`
          };
      }
    default:
      return undefined;
  }
}

export function getShareLinkImageUrl(group: GroupSummary): string | undefined {
  const background = getGroupBackground(group);
  const imageURL =
    background != null &&
    (background.type === 'PROFILE_IMAGE' || background.type === 'CURATED_IMAGE')
      ? background.src
      : undefined;

  return imageURL;
}
