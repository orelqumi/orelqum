# Orelqumi Technologies — Website Package

A lightweight, responsive, static **11-page** website for Orelqumi Technologies, Orelqumi Digital and Orelqumi Academy.

## Included pages
Home, About, Digital, Academy, Services, Courses, Portfolio, Contact, Request a Quote, Academy Enrolment, Privacy.

## How to preview
Open `index.html` in a modern browser. Photos and fonts require an internet connection. For best results, preview through a local web server (`python -m http.server 8000`) or GitHub Pages.

## GitHub Pages
Upload the **contents** of this folder to a repository root (not the zipped archive). In Settings → Pages, select Deploy from a branch and choose the main branch / root folder.

## Make enquiry forms usable
The forms deliberately **do not fake successful submissions**. On submit they open the visitor's email application with a prepared message. To direct those emails to your business inbox, set `window.ORELQUMI_CONTACT_EMAIL` in `assets/config.js` to a real, verified address. Test desktop and mobile email handlers before launch. For browser-based form submissions without requiring an email client, integrate a verified service or backend and add server-side validation, spam protection and confirmation messages. The current implementation is a functioning mailto enquiry flow, **not** a production form backend.

## Photography and licensing
Photographs are remotely loaded from Unsplash CDN. They are not bundled in the ZIP, keeping repository size small. The selected Unsplash images are intended for commercial website illustrations under the [Unsplash License](https://unsplash.com/license). Check each image, its provenance, recognisable people, third-party marks and any property/model releases before use in a high-profile campaign. Unsplash copyright permission does not waive publicity or trademark rights. A discreet 'Photography: Unsplash' credit is included.

Images require internet access, and the photo URLs could change. For a fully self-hosted site, download and optimise individual approved photos directly from their Unsplash listings after verifying rights. Replace `images.unsplash.com` links in HTML with relative paths.

## Important pre-launch checklist
- Complete trademark and business-name checks for Orelqumi Technologies.
- Register and connect the actual domain; domain availability has not been established.
- Configure a verified business email address, and optionally WhatsApp.
- Review proposed course options and set confirmed dates, fees and delivery formats.
- Replace portfolio **concepts** with genuine work after projects exist. No fabricated client testimonials or statistics have been used.
- Publish an operational privacy policy with lawful contact details and data processing terms.
- Verify all external images, usage rights and mobile rendering before public launch.

## Brand kit
Navy `#102746`, dark navy `#0b1b31`, electric blue `#2b86e8`, light background `#f3f7fb`; Manrope headings and DM Sans body. SVG brandmark in `assets/logo.svg`. Tagline: **Build Beyond Boundaries.**
