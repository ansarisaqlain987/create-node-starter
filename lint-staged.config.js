const prefix = process.cwd();
const ignored = [].map((s) => `${prefix}/${s}`);

const getGlob = (files) => files.filter((f) => !ignored.includes(f)).join(' ');

module.exports = {
  '*.{js,jsx,ts,tsx}': (files) => {
    const glob = getGlob(files);
    if (!glob) {
      return [];
    }
    const concurrentCommands = [`npx eslint ${glob}`];
    return [
      `npx concurrently ${concurrentCommands.map((c) => `"${c}"`).join(' ')}`,
    ];
  },
};
