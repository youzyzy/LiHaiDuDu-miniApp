import { PropsWithChildren } from 'react'
import Taro, { useLaunch } from '@tarojs/taro'

import './app.less'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')

    // 初始化微信云开发
    if (Taro.cloud) {
      Taro.cloud.init({
        env: 'cloud1-d8gvp57swad6f10f4',
        traceUser: true,
      })
    }
  })

  // children 是将要会渲染的页面
  return children
}
  


export default App
