import { SavedReelCard } from './saved-reel-card.entity';

export type SavedReelsSlice = {
  currentPage: number;
  nextPage: number | null;
  data: SavedReelCard[];
};
