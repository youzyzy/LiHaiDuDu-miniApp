const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { record } = event

  try {
    const data = {
      ...record,
      openid: wxContext.OPENID,
      createdAt: db.serverDate(),
      updatedAt: db.serverDate(),
    }

    const res = await db.collection('meal_records').add({ data })

    return {
      success: true,
      id: res._id,
    }
  } catch (err) {
    console.error('保存失败:', err)
    return {
      success: false,
      error: err.message,
    }
  }
}
