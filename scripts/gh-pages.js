const ghpages = require('gh-pages');

function callback() {
  console.log('doc deploy success.');
}

function main() {
  ghpages.publish(
    'dist',
    {
      branch: 'gh-pages',
      repo: 'https://gitee.com/flasco/book-story.git'
    },
    callback
  );
}

main();
