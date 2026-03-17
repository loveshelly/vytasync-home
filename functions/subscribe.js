export async function onRequestPost({ request, env }) {
  const origin = new URL(request.url).origin;
  
  try {
    const data = await request.formData();
    const email = data.get('email');
    const location = data.get('location') || 'unknown';
    
    // 1. 检查环境变量 (防止由于变量缺失导致崩溃)
    if (!env.KLAVIYO_PRIVATE_API_KEY) {
      return Response.redirect(`${origin}/?subscribe=error&msg=no_api_key_in_cf`, 303);
    }

    // 2. 发送请求给 Klaviyo
    const response = await fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/', {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${env.KLAVIYO_PRIVATE_API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'revision': '2024-02-15'
      },
      // 替换 subscribe.js 中 fetch 的 body 部分
body: JSON.stringify({
  data: {
    type: 'profile-subscription-bulk-create-job',
    attributes: {
      profiles: {
        data: [{
          type: 'profile',
          attributes: {
            email: email,
            properties: { "Signup_Source": location },
            // 明确添加订阅信息，解决 400 格式错误
            subscriptions: {
              email: {
                marketing: {
                  consent: "SUBSCRIBED"
                }
              }
            }
          }
        }]
      }
    },
    relationships: {
      list: {
        data: {
          type: 'list',
          id: KLAVIYO_LIST_ID
        }
      }
    }
  }
})

    // 3. 无论成功失败，必须重定向回首页
    if (response.ok) {
      return Response.redirect(`${origin}/?subscribe=success&from=${location}`, 303);
    } else {
      const errText = await response.text();
      // 这里我们在 URL 里加上 ERROR_CONFIRMED 标记
      return Response.redirect(`${origin}/?subscribe=error&status=${response.status}&details=ERROR_CONFIRMED`, 303);
    }
  } catch (err) {
    return Response.redirect(`${origin}/?subscribe=error&msg=catch_crash`, 303);
  }
}
