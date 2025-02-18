import { TTypeConfig } from "../types/config";
import {lilconfigSync } from "lilconfig";
import os from 'os'
import TypeScriptLoader from "@sliphua/lilconfig-ts-loader";
import { CONFIG_FILENAME, MODULE_NAME } from "./constants";

export async function resolveConfig(): Promise<TTypeConfig> {
  const config = lilconfigSync(MODULE_NAME, {
    stopDir: os.homedir(),
    searchPlaces: [CONFIG_FILENAME],
    loaders: {
      '.ts': TypeScriptLoader
    },
    ignoreEmptySearchPlaces: false,
  }).search()?.config

  return config
}
