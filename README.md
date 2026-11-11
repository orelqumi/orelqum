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


## Revised visual edition
This edition reduces excessive whitespace, features stronger photo-led interior page banners, denser service cards and improved spacing on mobile. Photography is linked from Unsplash and requires an internet connection; local backups are not embedded. Verify the rights applicable to any imagery used before publication.


## Motion edition notes
- Smooth entry animations, scroll reveal and animated navigation are enabled on modern browsers. Reduced-motion preferences are respected.
- The homepage media area now contains working tabs: Featured Videos, Live Sessions and Video Preview.
- Video Preview lets a visitor select a local MP4/WebM/Ogg file and play it in the browser only. Files are not uploaded, stored or published.
- The Live Sessions view is a labelled placeholder for a future verified broadcast URL. It does not falsely claim that a live stream is occurring.
- To show real public videos to everyone, embed videos hosted on an authorised provider or configure a production upload and streaming backend.

## Distinct text animations
Hero text appears word by word, section headings reveal on scroll with an accent underline, eyebrow text expands into view, navigation labels move slightly on hover, and button highlights sweep on hover. These effects automatically disable when a visitor requests reduced motion.


## School website packages (new)
- `school-packages.html` presents Starter (KSh 13,000), Standard (KSh 22,000) and Premium (KSh 40,000+) development offers.
- Optional maintenance plans: KSh 1,500 and KSh 3,000 per month. No payment processing or subscription activation is connected.
- The homepage and main navigation link to the pricing page.
- Quote buttons open `quote.html` and preselect the relevant package. The form still prepares an email draft only; set your verified email in `assets/config.js`.
- All prices and features are editable proposals. Verify capacity and costs before advertising them.

## Business positioning correction
- Orelqumi is primarily a website development service where visitors can find/hire a web developer for many types of website.
- The home page leads with hiring a developer and requesting a quote, not just school services.
- School website packages remain as one specialist offer under `school-packages.html`.
- This is a service enquiry website, **not** a searchable freelance developer marketplace or verified developer directory.
