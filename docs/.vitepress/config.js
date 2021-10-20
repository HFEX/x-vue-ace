module.exports = {
  title: 'x-vue-ace',
  base: '/',
  themeConfig: {
    repo: 'HFEX/x-vue-ace',
    nav: [
      { text: 'Guide', link: '/guide/', activeMatch: '^/$|^/guide/' },
      {
        text: 'API',
        link: '/api/',
        activeMatch: '^/api/'
      },
      {
        text: 'Release Notes',
        link: 'https://github.com/vuejs/vitepress/releases'
      }
    ],
  }
}
