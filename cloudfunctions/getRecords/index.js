const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    const res = await db.collection('meal_records')
      .where({ openid: wxContext.OPENID })
      .orderBy('createdAt', 'desc')
      .limit(200)
      .get()

    return {
      success: true,
      records: res.data,
    }
  } catch (err) {
    console.error('查询失败:', err)
    return {
      success: false,
      error: err.message,
      records: [],
    }
  }
}
