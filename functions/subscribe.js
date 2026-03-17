export async function onRequestPost({ request, env }) {
  try {
    const data = await request.formData();
    const email = data.get('email');
    const location = data.get('location') || 'unknown';
    
    // 你的 List ID
    const KLAVIYO_LIST_ID = 'Us6BtR'; 

    if (!email) return new Response('Email required', { status: 400 });

    // 修复后的 Klaviyo 订阅接口 (API Revision: 2024-02-15)
    const response = await fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/', {
      method: 'POST',
      headers: {
        // 请确保 Cloudflare 控制台里的变量名是 KLAVIYO_PRIVATE_API_KEY
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
            // 明确告知 Klaviyo 这是一个订阅动作
            subscriptions: {
              email: { marketing: { consent: "SUBSCRIBED" } }
            }
          }
        }]
      }
    },
    relationships: {
      list: {
        data: { type: 'list', id: KLAVIYO_LIST_ID }
      }
    }
  }
})

    // ... 前面的 fetch 代码 ...

    const origin = new URL(request.url).origin;

    if (response.ok) {
      return Response.redirect(`${origin}/?subscribe=success&from=${location}`, 303);
    } else {
      // 获取 Klaviyo 返回的具体错误代码（如 401 Unauthorized 或 404 Not Found）
      const errorText = await response.text();
      // 将具体的错误信息带在 URL 上
      return Response.redirect(`${origin}/?subscribe=error&debug_info=${encodeURIComponent(errorText)}`, 303);
    }
