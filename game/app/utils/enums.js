export const TEAMS = Object.freeze({
  TEAM_A: 0,
  TEAM_B: 1,
});

export const CARD_TYPES = Object.freeze({
  TEAM_A: TEAMS.TEAM_A,
  TEAM_B: TEAMS.TEAM_B,
  BYSTANDER: 2,
  ABORT: 3,
});

export const CARD_STATES = Object.freeze({
  COVERED: 0,
  UNCOVERED: 1,
});
