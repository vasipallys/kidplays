import type { Backdrop } from './asset';
import type { Sprite } from './sprite';

export type StageState = {
  width: number;
  height: number;
  backdropId: string;
};

export type LearnMeta = {
  subject: string;
  subjectId: string;
  band: string;
  bandId: string;
  practice: string;
};

export type Project = {
  id: string;
  name: string;
  description?: string;
  learn?: LearnMeta;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  sprites: Sprite[];
  backdrops: Backdrop[];
  activeSpriteId: string;
  stageState: StageState;
  globalVariables: Record<string, number | string | boolean>;
  version: number;
};
