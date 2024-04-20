import Config from './config.json'
import { BACKEND } from '../constants.js';
import { replaceAll } from '../scripts/utilities.js'
const Theme = replaceAll(Config, "__BACKEND__", BACKEND)

export default Theme