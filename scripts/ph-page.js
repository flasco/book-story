import ora from 'ora';
import { $ } from 'zx';

const main = async () => {
  const spinner = ora('deploy...').start();
  await $`npm publish --registry=https://registry.npmjs.org --access public`;
  spinner.succeed()
}

main();
