import { runMacro, getDependency } from './utils.js'

const Shemstuff = {
  runMacro, getDependency
}

Hooks.once('init', function () {
  self.Shemstuff = Shemstuff
})