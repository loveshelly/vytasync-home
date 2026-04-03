export async function onRequestPost({ request, env }) {
  try {
    const data = await request.formData();
    const email = data.get('email');
    const location = data.get('location') || 'unknown';
    const KLAVIYO_LIST_ID = 'Us6BtR';
        const KLAVIYO_API_KEY = env.KLAVIYO_PRIVATE_API_KEY || 'pk_d4603cd4986361623227a4d25f4de89bae'

    if (!email) {
      return Response.json({ ok: false, msg: 'no_email' }, { status: 400 });
    }

    const response = await fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/', {
      method: 'POST',
      headers: {
                'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
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
                    email: { marketing: { consent: 'SUBSCRIBED' } }
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
      return Response.json({ ok: true, location }, { status: 200 });
    } else {
      const errorDetail = await response.text();
      return Response.json({ ok: false, status: response.status, detail: errorDetail }, { status: 500 });
    }
  } catch (err) {
    return Response.json({ ok: false, msg: 'crash', error: err.message }, { status: 500 });
  }
}
