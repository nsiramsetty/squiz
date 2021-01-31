export type BeginnerKit = {
  title_top: string;
  title_bottom: string;
  background_image?: string;
};

export interface BeginnerKitService {
  getBeginnerKits(lang: string): Promise<BeginnerKit[]>;
}
