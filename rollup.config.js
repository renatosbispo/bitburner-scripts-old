import fs from 'fs';
import nodeResolve from '@rollup/plugin-node-resolve';

const config = [];
const buildTargetDirPath = `${__dirname}/src/scripts`;

const buildTargetFiles = fs.readdirSync(`${buildTargetDirPath}`, {
  encoding: 'utf8',
  withFileTypes: true,
});

function addFileToConfig(path) {
  config.push({
    input: path,
    output: {
      file: path.replace('/src/', '/dist/'),
      format: 'esm',
    },
    plugins: [nodeResolve()],
    watch: {
      include: path,
    },
    treeshake: 'recommended',
  });
}

buildTargetFiles.forEach((file) => {
  if (file.isFile() && file.name.endsWith('.js')) {
    addFileToConfig(`${buildTargetDirPath}/${file.name}`);
  }
});

export default config;
