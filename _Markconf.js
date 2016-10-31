const Markconf = {
  modifiers: {
    core: {
      markdown: 'markserv-contrib-mod.markdown'
      // markdown: 'markserv-contrib-app.github'
      // http404: 'markserv-mod-http-404',
      // file: 'markserv-mod-file'
    },

    path: {
      // 'tests/posts/**/*.md': 'markserv-mod-post'
    }
  },

  rewrites: {
    'test/redirect-a/**/*': 'test/redirect-b/**/*'
  }
};

module.exports = Markconf;
