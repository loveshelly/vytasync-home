export async function onRequestPost({ request, env }) {
  const origin = new URL(request.url).origin;
  
  try {
    const data = await request.formData();
    const email = data.get('email');
    const location = data.get('location') || 'unknown';
    const KLAVIYO_LIST_ID = 'Us6BtR';

    if (!email) return Response.redirect(`${origin}/?subscribe=error&msg=no_email`, 303);

    const response = await fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/', {
      method: 'POST',
      headers: {
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
                  subscriptions: {
                    email: { marketing: { consent: "SUBSCRIBED" } }
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
    });

    if (response.ok) {
      // 成功：跳回首页并触发 GA4
      return Response.redirect(`${origin}/?subscribe=success&from=${location}`, 303);
    } else {
      // 失败：抓取详细报错信息
      const errorDetail = await response.text();
      return Response.redirect(`${origin}/?subscribe=error&status=${response.status}&detail=${encodeURIComponent(errorDetail)}`, 303);
    }
  } catch (err) {
    return Response.redirect(`${origin}/?subscribe=error&msg=crash`, 303);
  }
}
