import {
  calculateAllRoundScores,
  evaluateAllRounds,
  parseAllPlayerPicksFirstInterp,
  parseAllPlayerPicksSecondInterp,
  parsePlayerPicksSecondInterp,
  Pick,
  splitRounds
} from './index';
import _ from 'lodash';

describe('tests day2', () => {
  const exampleInput = `A Y
B X
C Z
`;

  describe('parsePlayerPicksSecondInterp', () => {
    it('parses losses correctly', () => {
      // given
      const pickRock = 'A X';
      const pickPaper = 'B X';
      const pickScissors = 'C X';

      // when
      const parsedRoundRock = parsePlayerPicksSecondInterp(pickRock);
      const parsedRoundPaper = parsePlayerPicksSecondInterp(pickPaper);
      const parsedRoundScissors = parsePlayerPicksSecondInterp(pickScissors);

      // then
      expect(parsedRoundRock).toEqual({ opponentPick: Pick.Rock, yourPick: Pick.Scissors });
      expect(parsedRoundPaper).toEqual({ opponentPick: Pick.Paper, yourPick: Pick.Rock });
      expect(parsedRoundScissors).toEqual({ opponentPick: Pick.Scissors, yourPick: Pick.Paper });
    });

    it('parses draws correctly', () => {
      // given
      const pickRock = 'A Y';
      const pickPaper = 'B Y';
      const pickScissors = 'C Y';

      // when
      const parsedRoundRock = parsePlayerPicksSecondInterp(pickRock);
      const parsedRoundPaper = parsePlayerPicksSecondInterp(pickPaper);
      const parsedRoundScissors = parsePlayerPicksSecondInterp(pickScissors);

      // then
      expect(parsedRoundRock).toEqual({ opponentPick: Pick.Rock, yourPick: Pick.Rock });
      expect(parsedRoundPaper).toEqual({ opponentPick: Pick.Paper, yourPick: Pick.Paper });
      expect(parsedRoundScissors).toEqual({ opponentPick: Pick.Scissors, yourPick: Pick.Scissors });
    });

    it('parses wins correctly', () => {
      // given
      const pickRock = 'A Z';
      const pickPaper = 'B Z';
      const pickScissors = 'C Z';

      // when
      const parsedRoundRock = parsePlayerPicksSecondInterp(pickRock);
      const parsedRoundPaper = parsePlayerPicksSecondInterp(pickPaper);
      const parsedRoundScissors = parsePlayerPicksSecondInterp(pickScissors);

      // then
      expect(parsedRoundRock).toEqual({ opponentPick: Pick.Rock, yourPick: Pick.Paper });
      expect(parsedRoundPaper).toEqual({ opponentPick: Pick.Paper, yourPick: Pick.Scissors });
      expect(parsedRoundScissors).toEqual({ opponentPick: Pick.Scissors, yourPick: Pick.Rock });
    });
  });

  describe('day2 functions', () => {
    it('calculates example correctly for first interpretation of the strategy guide', () => {
      // when
      const strategyGuideInRounds = splitRounds(exampleInput);
      const playerPicks = parseAllPlayerPicksFirstInterp(strategyGuideInRounds);
      const finalScore = calculateAllRoundScores(evaluateAllRounds(playerPicks));

      // then
      expect(_.sum(finalScore)).toEqual(15);
    });

    it('calculates example correctly for second interpretation of the strategy guide', () => {
      // when
      const strategyGuideInRounds = splitRounds(exampleInput);
      const playerPicks = parseAllPlayerPicksSecondInterp(strategyGuideInRounds);
      const finalScore = calculateAllRoundScores(evaluateAllRounds(playerPicks));

      // then
      expect(_.sum(finalScore)).toEqual(12);
    });
  });
});
