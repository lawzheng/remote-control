import { removeSync, moveSync } from 'fs-extra/esm'
const dest = '../../pages/main'
removeSync(dest)
moveSync('./dist', '../../pages/main')
