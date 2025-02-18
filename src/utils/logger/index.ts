import {blue, red} from 'yoctocolors-cjs'

function todo(...texts: string[]) {
  return console.log(blue('TODO:'), ...texts)
}

function info(...texts: string[]) {
  return console.log(...texts)
}

function error(...texts: string[]) {
  return console.log(red('Error:'), ...texts)
}

export const logger = {
  todo,
  error,
  info,
}
