# EmailJS dealtemplate variabelen

Maak in EmailJS bij voorkeur een aparte template voor de dealbevestiging en gebruik de HTML uit `emailjs-deal-template.html`.

Velden uit `deal-bevestiging.html`:

- `{{deal_id}}`
- `{{status}}`
- `{{customer_name}}`
- `{{company_name}}`
- `{{customer_email}}`
- `{{customer_phone}}`
- `{{barterweb_deliverable}}`
- `{{barterweb_scope}}`
- `{{customer_trade}}`
- `{{customer_trade_details}}`
- `{{barterweb_value}}`
- `{{customer_value}}`
- `{{barterweb_delivery_date}}`
- `{{customer_delivery_date}}`
- `{{signature_status}}`

Extra aliases die de site meestuurt voor betere EmailJS-compatibiliteit:

- `{{to_email}}` zelfde waarde als `customer_email`
- `{{email}}` zelfde waarde als `customer_email`
- `{{reply_to}}` zelfde waarde als `customer_email`
- `{{name}}` zelfde waarde als `customer_name`
- `{{from_name}}` zelfde waarde als `customer_name`
- `{{project_type}}`
- `{{website_url}}`
- `{{logo_url}}`
- `{{message}}`

Aanbevolen onderwerp:

```text
BarterWeb dealbevestiging {{deal_id}}
```

Belangrijk: zet in EmailJS bij `To email` bij voorkeur:

```text
{{to_email}}
```

`{{customer_email}}` werkt ook, maar `{{to_email}}` is duidelijker en wordt nu expliciet meegestuurd.

Zet jezelf als BCC of gebruik een tweede notification-template voor een interne kopie.
