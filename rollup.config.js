import fs from 'fs';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

const config = [];
const buildTargetDirPath = `${__dirname}/src/scripts`;

function addFileToConfig(path) {
  config.push({
    input: path,
    output: {
      file: path.replace('/src/', '/dist/'),
      format: 'esm',
    },
    plugins: [commonjs(), nodeResolve()],
    watch: {
      include: `${__dirname}/src/**`,
    },
    treeshake: 'recommended',
  });
}

function addFilesToConfig(dirPath) {
  const dirEntries = fs.readdirSync(`${dirPath}`, {
    encoding: 'utf8',
    withFileTypes: true,
  });

  dirEntries.forEach((dirEntry) => {
    if (dirEntry.isFile() && dirEntry.name.endsWith('.js')) {
      addFileToConfig(`${dirPath}/${dirEntry.name}`);
    } else if (dirEntry.isDirectory()) {
      addFilesToConfig(`${dirPath}/${dirEntry.name}`);
    }
  });
}

addFilesToConfig(buildTargetDirPath);

export default config;
