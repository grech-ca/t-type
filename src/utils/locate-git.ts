import {exec} from 'child_process'

export async function locateGit() {
  const dir = await new Promise(
    (resolve, reject) => exec('git rev-parse --show-toplevel',
    (error, stdout) =>  (error) ? reject(error) : resolve(stdout.trim()))
  )

  return dir as string | null
}
