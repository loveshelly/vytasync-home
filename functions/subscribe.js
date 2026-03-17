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

    const origin = new URL(request.url).origin;

    if (response.ok) {
      // 成功：跳回首页并带上参数，触发 GA4 脚本
      return Response.redirect(`${origin}/?subscribe=success&from=${location}`, 303);
    } else {
      // 失败：记录错误并跳回
      const errorText = await response.text();
      console.error('Klaviyo Error:', errorText);
      return Response.redirect(`${origin}/?subscribe=error`, 303);
    }
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
