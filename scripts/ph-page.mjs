import ghpages from 'gh-pages';
import ora from 'ora';

function main() {
  const spinner = ora('deploy...').start();

  ghpages.publish(
    'dist',
    {
      branch: 'gh-pages',
      repo: 'https://gitee.com/flasco/book-story.git',
    },
    () => spinner.succeed()
  );
}

main();
