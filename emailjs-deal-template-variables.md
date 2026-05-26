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
- `{{signature_data}}`

Aanbevolen onderwerp:

```text
BarterWeb dealbevestiging {{deal_id}}
```

Belangrijk: zet in EmailJS bij `To email` de variabele:

```text
{{customer_email}}
```

Zet jezelf als BCC of gebruik een tweede notification-template voor een interne kopie.
