export async function onRequestPost({ request, env }) {
  try {
    const data = await request.formData();
    const email = data.get('email');
    const location = data.get('location') || 'unknown';
    
    // 🌟 请务必将下方引号内的内容替换为您 Klaviyo 的 6 位 List ID
    const KLAVIYO_LIST_ID = 'Us6BtR'; 

    if (!email) return new Response('Email required', { status: 400 });

    const response = await fetch(`https://a.klaviyo.com/api/lists/${KLAVIYO_LIST_ID}/profiles/`, {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${env.KLAVIYO_PRIVATE_API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'revision': '2024-02-15'
      },
      body: JSON.stringify({
        data: {
          type: 'profile',
          attributes: {
            email: email,
            properties: { "Signup_Source": location }
          }
        }
      })
    });

    if (response.ok) {
      // 订阅成功后重定向回首页，并带上参数触发 GA4 统计
      return Response.redirect(`${new URL(request.url).origin}/?subscribe=success&from=${location}`, 303);
    }
    return new Response('Klaviyo Error', { status: 500 });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
