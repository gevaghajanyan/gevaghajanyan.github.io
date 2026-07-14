export type ContribDay = { date: string; count: number; level: number };

export const LEVELS = {
  fill:   ['', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  border: ['', '#7ed89a', '#2ea44f', '#238636', '#196127'],
};

export const EXPLOSION_COLORS = ['#39d353', '#26a641', '#006d32', '#9be9a8', '#ffffff', '#40c463'];

// Score thresholds for each blast level: index = level, value = required score
// Lines at each level: 1, 3, 5, 7, 9
export const BLAST_THRESHOLDS = [0, 1000, 2500, 5000, 10000] as const;
