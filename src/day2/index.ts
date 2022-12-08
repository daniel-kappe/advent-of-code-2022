import { readInput } from '../utils';
import _ from 'lodash';

export enum Pick {
  Rock = 1,
  Paper = 2,
  Scissors = 3
}

export enum GameScore {
  Win = 6,
  Draw = 3,
  Loose = 0
}

export const splitRounds = (strategyInput: string) => strategyInput.trimEnd().split(/\n/);

export const parsePlayerPicksFirstInterp = (gameRound: string) => {
  const [opponentPick, yourPick] = gameRound.split(' ');
  let opponentPickParsed, yourPickparsed;
  switch (opponentPick) {
    case 'A':
      opponentPickParsed = Pick.Rock;
      break;
    case 'B':
      opponentPickParsed = Pick.Paper;
      break;
    case 'C':
      opponentPickParsed = Pick.Scissors;
      break;
  }
  switch (yourPick) {
    case 'X':
      yourPickparsed = Pick.Rock;
      break;
    case 'Y':
      yourPickparsed = Pick.Paper;
      break;
    case 'Z':
      yourPickparsed = Pick.Scissors;
      break;
  }
  return {
    opponentPick: opponentPickParsed,
    yourPick: yourPickparsed
  } as PlayedRound;
};

export const parsePlayerPicksSecondInterp = (gameRound: string) => {
  const [opponentPick, yourPick] = gameRound.split(' ');
  let opponentPickParsed, yourPickparsed;
  switch (opponentPick) {
    case 'A':
      opponentPickParsed = Pick.Rock;
      break;
    case 'B':
      opponentPickParsed = Pick.Paper;
      break;
    case 'C':
      opponentPickParsed = Pick.Scissors;
      break;
    default:
      opponentPickParsed = -1;
      break;
  }
  switch (yourPick) {
    case 'X':
      yourPickparsed = opponentPickParsed - 1;
      yourPickparsed = yourPickparsed === 0 ? 3 : yourPickparsed;
      break;
    case 'Y':
      yourPickparsed = opponentPickParsed;
      break;
    case 'Z':
      yourPickparsed = opponentPickParsed + 1;
      yourPickparsed = yourPickparsed === 4 ? 1 : yourPickparsed;
      break;
  }
  return {
    opponentPick: opponentPickParsed,
    yourPick: yourPickparsed
  } as PlayedRound;
};

export const parseAllPlayerPicksFirstInterp = (strategyGuide: string[]) =>
  strategyGuide.map((round) => parsePlayerPicksFirstInterp(round));

export const parseAllPlayerPicksSecondInterp = (strategyGuide: string[]) =>
  strategyGuide.map((round) => parsePlayerPicksSecondInterp(round));

export type PlayedRound = {
  opponentPick: Pick;
  yourPick: Pick;
};

export type GameOutcome = {
  yourPick: Pick;
  gameScore: GameScore;
};

export const evaluateRound = (playedRound: PlayedRound) => {
  let gameScore: number;
  switch (playedRound.yourPick - playedRound.opponentPick) {
    case 0:
      gameScore = GameScore.Draw;
      break;
    case 1:
      gameScore = GameScore.Win;
      break;
    case 2:
      gameScore = GameScore.Loose;
      break;
    case -1:
      gameScore = GameScore.Loose;
      break;
    case -2:
      gameScore = GameScore.Win;
      break;
    default:
      gameScore = -1;
  }
  return { yourPick: playedRound.yourPick, gameScore } as GameOutcome;
};

export const evaluateAllRounds = (playedRounds: PlayedRound[]) =>
  playedRounds.map((playedRound) => evaluateRound(playedRound));

export const calculateRoundScores = (gameOutcome: GameOutcome) => gameOutcome.yourPick + gameOutcome.gameScore;

export const calculateAllRoundScores = (gameOutcomes: GameOutcome[]) =>
  gameOutcomes.map((gameOutcome) => calculateRoundScores(gameOutcome));

export default function solveDay2() {
  const strategyGuide = readInput('./inputs/day2.dat');
  const strategyGuideInRounds = splitRounds(strategyGuide);
  const playedRoundsFirstInterp = parseAllPlayerPicksFirstInterp(strategyGuideInRounds);
  const evaluatedRoundsFirstInterp = evaluateAllRounds(playedRoundsFirstInterp);
  const roundScoresFirstInterp = calculateAllRoundScores(evaluatedRoundsFirstInterp);
  const playedRoundsSecondInterp = parseAllPlayerPicksSecondInterp(strategyGuideInRounds);
  const evaluatedRoundsSecondInterp = evaluateAllRounds(playedRoundsSecondInterp);
  const roundScoresSecondInterp = calculateAllRoundScores(evaluatedRoundsSecondInterp);
  console.log(`You get a score of ${_.sum(roundScoresFirstInterp)} based on your understanding`);
  console.log(`You get a score of ${_.sum(roundScoresSecondInterp)} based on the others understanding`);
}
