import { readInput } from '../utils';
import _, { parseInt } from 'lodash';

export type File = {
  name: string;
  size: number;
};

export class Directory {
  public subdirectories: Record<string, Directory>;
  public files: File[];
  public totalFileSize: number;

  constructor(public readonly fsRoot: Directory | undefined, public readonly directoryRoot: Directory | undefined) {
    this.subdirectories = {};
    this.files = [];
    this.totalFileSize = 0;
  }

  addDirectory(newDirectoryName: string) {
    this.subdirectories[newDirectoryName] = new Directory(this.fsRoot ?? this, this);
  }

  addFile(fileName: string, fileSize: number) {
    this.files.push({ name: fileName, size: fileSize });
    this.totalFileSize += fileSize;
  }
}

export type Path = string[];

export const parseCommands = (commandInputs: string) =>
  _.tail(commandInputs.trimEnd().split('$')).reduce(
    (currentDirectory, commandString) => parseCommand(currentDirectory, commandString) as Directory,
    new Directory(undefined, undefined)
  );

export const parseCommand = (directory: Directory, commandString: string) => {
  const [command, ...output] = commandString.trim().split('\n');
  if (command.includes('cd')) {
    const cdValue = _.last(command.split(' ')) as string;
    if (cdValue === '/') {
      return directory.fsRoot ?? directory;
    }
    return cdValue === '..' ? directory.directoryRoot : directory.subdirectories[cdValue];
  } else if (command.includes('ls')) {
    output.forEach((outputRow) => {
      if (outputRow.startsWith('dir')) {
        directory.addDirectory(outputRow.split(' ')[1]);
      } else {
        const [fileSize, fileName] = outputRow.split(' ', 2);
        directory.addFile(fileName, parseInt(fileSize));
      }
    });
    return directory;
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars

export const processSmallFileSizes = (currentDirectory: Directory) => {
  let totalSmallFileSize = 0;
  for (const subdirectory in currentDirectory.subdirectories) {
    const [subDirSize, subTotalSmallFiles] = processSmallFileSizes(currentDirectory.subdirectories[subdirectory]);
    if (subDirSize < 100000) {
      totalSmallFileSize += subDirSize;
    }
    totalSmallFileSize += subTotalSmallFiles;
    currentDirectory.totalFileSize += subDirSize;
  }
  return [currentDirectory.totalFileSize, totalSmallFileSize];
};

export const findBigEnoughDirectories = (currentDirectory: Directory, neededSpace: number) => {
  const bigEnoughDirectories = [] as number[];
  for (const subdirectory in currentDirectory.subdirectories) {
    const subBigEnough = findBigEnoughDirectories(currentDirectory.subdirectories[subdirectory], neededSpace);
    bigEnoughDirectories.push(...subBigEnough);
  }
  if (currentDirectory.totalFileSize >= neededSpace) {
    bigEnoughDirectories.push(currentDirectory.totalFileSize);
  }
  return bigEnoughDirectories;
};

export default function solveDay7() {
  const consoleDump = readInput('./inputs/day7.dat');
  const endingDirectory = parseCommands(consoleDump);
  const fileSystem = endingDirectory.fsRoot ?? endingDirectory;
  const [totalFileSize, totalSmallFileSize] = processSmallFileSizes(fileSystem);
  const bigEnoughDirectories = findBigEnoughDirectories(fileSystem, totalFileSize - 40000000);
  console.log(`All small file directories total to a size of: ${totalSmallFileSize}`);
  console.log(`The best directory to delete has a size of: ${bigEnoughDirectories.sort((a, b) => a - b)[0]}`);
}
