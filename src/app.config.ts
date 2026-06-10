export default {
  pages: [
    'pages/home/index',
    'pages/entry/index',
    'pages/reflection/index',
    'pages/summary/index',
  ],
  tabBar: {
    color: '#666666',
    selectedColor: '#4A6FA5',
    backgroundColor: '#F5F0E8',
    list: [
      { pagePath: 'pages/home/index', text: '主页' },
      { pagePath: 'pages/entry/index', text: '记录' },
      { pagePath: 'pages/reflection/index', text: '反思' },
      { pagePath: 'pages/summary/index', text: '总结' },
    ],
  },
  window: {
    navigationBarBackgroundColor: '#F5F0E8',
    navigationBarTitleText: '正念饮食',
  },
}
