import { LibraryItem } from 'services/libraryItem/interface';

export interface Playlist {
  id: string;
  title: string;
  description: string;
  followers: number;
  private: boolean;
  owner_username: string;
  owner_name: string;
  owner_id: string;
  is_owner_publisher: boolean;
  tracks: LibraryItem[];
  hashtags?: string[];
};

