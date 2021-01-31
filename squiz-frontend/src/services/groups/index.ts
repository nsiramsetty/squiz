import Axios from 'axios';
import { getIdToken } from 'lib/firebase/auth';

const GROUPS_API_BASEURL = `https://groups-api.insighttimer-api.net/api/v1/groups`;

interface DateTime {
  epoch: number;
}

export type BackgroundType =
  | 'CURATED_IMAGE'
  | 'COLOUR_SOLID'
  | 'PROFILE_IMAGE'
  | 'COLOUR_GRADIENT';
export type BackgroundColourGradientDirection = 'ltr' | 'rtl';

export interface BackgroundColourGradient {
  gradient_direction: BackgroundColourGradientDirection;
  gradient_from: string;
  gradient_to: string;
}

export interface Background {
  background_preset_image?: string;
  background_colour_solid?: string;
  background_colour_gradient?: BackgroundColourGradient;
  type: BackgroundType;
}

export interface GroupSummary {
  id: string;
  type: 'ENTERPRISE' | 'GROUP';
  name: string;
  member_count: number;
  privacy_type: 'PUBLIC' | 'PRIVATE';
  long_description: string;
  background: Background;
  admins: GroupAdmin[];
  email_domains: string[];
  _selected_group_members?: UserSummary[];
}

export interface Group {
  id: string;
  name: string;
  is_admin: boolean;
  is_invited: boolean;
  is_owner: boolean;
  has_joined: boolean;
  joined_at: DateTime;
  member_count: number;
  privacy_type: 'PUBLIC' | 'PRIVATE';
  group_summary: GroupSummary;
  admins: GroupAdmin[];
}

export interface UserSummary {
  name: string;
  id: string;
  has_avatar?: boolean;
  username?: string;
  is_admin?: boolean;
}

export type GroupAdmin = UserSummary;

export interface GroupMember {
  id: string;
  user_summary: UserSummary;
}

export interface GroupRelation {
  id: string;
  is_invited?: boolean;
  has_joined?: boolean;
  is_approved?: boolean;
  group_summary: GroupSummary;
}

async function getBearerToken() {
  return getIdToken();
}

async function getRequest(url: string): Promise<{ data: any }> {
  try {
    const bearerToken = await getBearerToken();
    if (bearerToken) {
      return Axios.get(url, {
        headers: {
          Authorization: `Bearer ${bearerToken}`
        }
      });
    }

    console.error('services/groups: No bearer token for groups api request');
    return Promise.resolve({ data: undefined });
  } catch (e) {
    console.error('services/groups: Not authenticated on firebase', e);
    return Promise.resolve({ data: undefined });
  }
}

async function postRequest(url: string, params: any): Promise<{ data: any }> {
  try {
    const bearerToken = await getBearerToken();
    if (bearerToken) {
      return Axios.post(url, params, {
        headers: {
          Authorization: `Bearer ${bearerToken}`
        }
      });
    }

    console.error('services/groups: No bearer token for groups api request');
    return Promise.resolve({ data: undefined });
  } catch (e) {
    console.error('services/groups: Not authenticated on firebase', e);
    return Promise.resolve({ data: undefined });
  }
}

export async function getGroups() {
  const response = await getRequest(`${GROUPS_API_BASEURL}`);
  const groups: Group[] = response.data;

  return groups;
}

export async function joinGroup(groupId: string) {
  try {
    await postRequest(`${GROUPS_API_BASEURL}/${groupId}/members`, {
      action: 'JOIN'
    });
    return true;
  } catch (e) {
    throw e.response.data.message;
  }
}

export async function inviteUserToGroup(userId: string, groupId: string) {
  try {
    await postRequest(`${GROUPS_API_BASEURL}/${groupId}/members`, {
      action: 'INVITE',
      memberId: userId
    });
    return true;
  } catch (e) {
    throw e.response.data.message;
  }
}

export async function getInvitations() {
  try {
    const response = await getRequest(`${GROUPS_API_BASEURL}/invitations`);
    const groupInvitations: GroupRelation[] = response.data;

    return groupInvitations;
  } catch (e) {
    throw e.response.data.message;
  }
}

export async function getGroup(id: string) {
  const response = await Axios.get(
    `https://groups.insighttimer-api.net/${id}%2Fdata%2Fgroup.json`
  );
  const group: GroupSummary = {
    id,
    ...response.data
  };

  return group;
}

export async function getGroupRelation(id: string) {
  try {
    const response = await getRequest(`${GROUPS_API_BASEURL}/${id}/relation`);
    const groupRelation: GroupRelation | undefined = response.data;

    return groupRelation;
  } catch (e) {
    throw e.response.data.message;
  }
}

export async function postGroupJoinRequest(id: string) {
  // TODO: POST /api/v1/groups/invitations
  return getGroup(id);
}
