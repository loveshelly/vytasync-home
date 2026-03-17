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
      body: JSON.stringify({
        data: {
          type: 'profile-subscription-bulk-create-job',
          attributes: {
            profiles: {
              data: [{
                type: 'profile',
                attributes: {
                  email: email,
                  properties: { "Signup_Source": location }
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
    });

    // ... 前面的 fetch 代码 ...

    const origin = new URL(request.url).origin;

    if (response.ok) {
      // 成功：跳回首页并带上 success 参数
      return Response.redirect(`${origin}/?subscribe=success&from=${location}`, 303);
    } else {
      // 失败：即便失败也要跳回首页，但带上 error 参数，防止页面卡死
      const errorData = await response.text();
      console.error("Klaviyo API Error:", errorData);
      return Response.redirect(`${origin}/?subscribe=error`, 303);
    }
  } catch (err) {
    // 捕获脚本崩溃错误并跳回
    return Response.redirect(`${new URL(request.url).origin}/?subscribe=server_error`, 303);
  }
}
