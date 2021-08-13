module.exports = {
  title: 'x-vue-ace',
  base: '/',
  themeConfig: {
    repo: 'HFEX/x-vue-ace',
    nav: [
      { text: 'Guide', link: '/', activeMatch: '^/$|^/guide/' },
      {
        text: 'Config Reference',
        link: '/config/basics',
        activeMatch: '^/config/'
      },
      {
        text: 'Release Notes',
        link: 'https://github.com/vuejs/vitepress/releases'
      }
    ],
  }
}
