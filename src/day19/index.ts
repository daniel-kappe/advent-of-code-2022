import _ from 'lodash';
import { readInput } from '../utils';

export default function solveDay19() {
  const exampleInput = `\
Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.
`;
  const puzzleInput = readInput('inputs/day19.dat');
  const blueprints = parseAllBlueprints(puzzleInput);
  console.log(`The sum of all quality levels is: ${sumQualityLevels(blueprints, 24, 10000)}`);

  const firstBlueprintGeodes = evaluateAllBuildPaths(blueprints[0], 32, 10000, true);
  const secondBlueprintGeodes = evaluateAllBuildPaths(blueprints[1], 32, 10000, true);
  const thirdBlueprintGeodes = evaluateAllBuildPaths(blueprints[2], 32, 10000, true);
  console.log(`The product of all geodes is: ${firstBlueprintGeodes * secondBlueprintGeodes * thirdBlueprintGeodes}`);
}

export const sumQualityLevels = (blueprints: RobotCosts[], totalTime: number, maxBuildPathNumber = 100) =>
  _.sum(
    blueprints.map((blueprint, index) => evaluateAllBuildPaths(blueprint, totalTime, maxBuildPathNumber) * (index + 1))
  );

export function evaluateAllBuildPaths(
  blueprint: RobotCosts,
  totalTime: number,
  maxBuildPathNumber = 100,
  valueSetup = false
) {
  let buildPaths: BuildPath[] = [{ resources: getStartingResources(), robots: getStartingRobots() }];
  for (let i = 0; i < totalTime; i++) {
    const buildPathLength = buildPaths.length;
    for (let buildPathIndex = 0; buildPathIndex < buildPathLength; buildPathIndex++) {
      // eslint-disable-next-line prefer-const
      let { resources, robots } = buildPaths[buildPathIndex];
      const possibleBuilds = getPossibleBuilds(resources, blueprint);
      resources = updateResources(resources, robots);
      for (const build of possibleBuilds) {
        buildPaths.push(buildRobot(resources, robots, build, blueprint));
      }
      buildPaths[buildPathIndex].resources = resources;
    }
    buildPaths = buildPaths
      .sort((pathA, pathB) => scoreBuildPath(pathB, valueSetup) - scoreBuildPath(pathA, valueSetup))
      .slice(0, maxBuildPathNumber);
  }
  return Math.max(...buildPaths.map((buildPath) => buildPath.resources.geode));
}

export const scoreBuildPath = (buildPath: BuildPath, valueSetup: boolean) => {
  const { ore, clay, obsidian, geode } = buildPath.resources;
  const { oreRobot, clayRobot, obsidianRobot, geodeRobot } = buildPath.robots;
  return (
    ore +
    clay * 10 +
    obsidian * 100 +
    geode * 1000 +
    oreRobot * (valueSetup ? 40000 : 4) +
    clayRobot * (valueSetup ? 400000 : 40) +
    obsidianRobot * (valueSetup ? 4000000 : 400) +
    geodeRobot * (valueSetup ? 40000000 : 4000)
  );
};

export const buildRobot = (resources: Resources, robots: Robots, robotToBuild: RobotName, robotCosts: RobotCosts) => {
  const buildCosts = robotCosts[robotToBuild];
  const updatedRobots = { ...robots };
  updatedRobots[robotToBuild] += 1;
  return {
    resources: {
      ore: resources.ore - buildCosts.ore,
      clay: resources.clay - buildCosts.clay,
      obsidian: resources.obsidian - buildCosts.obsidian,
      geode: resources.geode
    },
    robots: updatedRobots
  } as BuildPath;
};

export const getPossibleBuilds = (resources: Resources, robotCosts: RobotCosts) => {
  const possibleRobotBuilds: RobotName[] = [];
  if (hasEnoughResources(resources, robotCosts.oreRobot)) possibleRobotBuilds.push('oreRobot');
  if (hasEnoughResources(resources, robotCosts.clayRobot)) possibleRobotBuilds.push('clayRobot');
  if (hasEnoughResources(resources, robotCosts.obsidianRobot)) possibleRobotBuilds.push('obsidianRobot');
  if (hasEnoughResources(resources, robotCosts.geodeRobot)) possibleRobotBuilds.push('geodeRobot');
  return possibleRobotBuilds;
};

export const updateResources = (resources: Resources, robots: Robots) =>
  ({
    ore: resources.ore + robots.oreRobot,
    clay: resources.clay + robots.clayRobot,
    obsidian: resources.obsidian + robots.obsidianRobot,
    geode: resources.geode + robots.geodeRobot
  } as Resources);

export const hasEnoughResources = (resources: Resources, resourceCosts: Resources) =>
  resources.ore >= resourceCosts.ore &&
  resources.clay >= resourceCosts.clay &&
  resources.obsidian >= resourceCosts.obsidian;

export const parseAllBlueprints = (blueprintStrings: string) => blueprintStrings.trim().split(/\n/).map(parseBlueprint);

export const parseBlueprint = (blueprintString: string) => {
  const [, costString] = blueprintString.split(': ');
  const [oreRobot, clayRobot, obsidianRobot, geodeRobot] = costString.split('.').map(parseCosts);
  return { oreRobot, clayRobot, obsidianRobot, geodeRobot } as RobotCosts;
};

export const parseCosts = (costsString: string) => {
  const ore = parseInt((costsString.match(/\d+ ore/) ?? ['0 '])[0].split(' ')[0], 10);
  const clay = parseInt((costsString.match(/\d+ clay/) ?? ['0 '])[0].split(' ')[0], 10);
  const obsidian = parseInt((costsString.match(/\d+ obsidian/) ?? ['0 '])[0].split(' ')[0], 10);
  return { ore, clay, obsidian, geode: 0 } as Resources;
};

export const getStartingResources = () => ({ ore: 0, clay: 0, obsidian: 0, geode: 0 } as Resources);
export const getStartingRobots = () => ({ oreRobot: 1, clayRobot: 0, obsidianRobot: 0, geodeRobot: 0 } as Robots);

export type Resources = {
  ore: number;
  clay: number;
  obsidian: number;
  geode: number;
};

type GenericRobot<T> = {
  oreRobot: T;
  clayRobot: T;
  obsidianRobot: T;
  geodeRobot: T;
};

export type RobotCosts = GenericRobot<Resources>;

export type Robots = GenericRobot<number>;

export type RobotName = 'oreRobot' | 'clayRobot' | 'obsidianRobot' | 'geodeRobot';

export type BuildPath = { resources: Resources; robots: Robots };
