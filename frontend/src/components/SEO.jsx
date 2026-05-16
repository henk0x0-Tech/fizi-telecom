import { Helmet } from 'react-helmet-async';

const BASE_URL   = 'https://fizitelecom.com';
const SITE_NAME  = 'Fizi Telecom';
const OG_IMAGE   = `${BASE_URL}/og-image.webp`;
const LOGO_URL   = `${BASE_URL}/favicon.webp`;

export default function SEO({
  title,
  description,
  canonical,
  image = OG_IMAGE,
  type = 'website',
  noIndex = false,
  keywords = 'Fizi Telecom, fiber internet, enterprise networking, CCTV, IT infrastructure, Fizi DRC',
  schemaType = 'WebPage',
}) {
  const fullTitle     = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — Fiber Internet, Enterprise IT & Security Solutions`;
  const fullCanonical = canonical ? `${BASE_URL}${canonical}` : BASE_URL;
  const safeDesc      = description || 'Fizi Telecom delivers high-speed fiber internet, enterprise networking, CCTV surveillance, cloud solutions, and IT infrastructure services in Fizi, DRC.';

  const schema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: fullTitle,
    url: fullCanonical,
    description: safeDesc,
    image,
    isPartOf: { '@id': `${BASE_URL}/#website` },
    publisher: {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
  };

  return (
    <Helmet>
      {/* ── Primary ── */}
      <title>{fullTitle}</title>
      <meta name="description"              content={safeDesc} />
      <meta name="keywords"                 content={keywords} />
      <meta name="robots"                   content={noIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large'} />
      <link rel="canonical"                 href={fullCanonical} />

      {/* ── Open Graph ── */}
      <meta property="og:title"             content={fullTitle} />
      <meta property="og:description"       content={safeDesc} />
      <meta property="og:url"               content={fullCanonical} />
      <meta property="og:image"             content={image} />
      <meta property="og:image:width"       content="1200" />
      <meta property="og:image:height"      content="630" />
      <meta property="og:image:alt"         content={fullTitle} />
      <meta property="og:type"              content={type} />
      <meta property="og:site_name"         content={SITE_NAME} />
      <meta property="og:locale"            content="en_US" />

      {/* ── Twitter / X ── */}
      <meta name="twitter:card"             content="summary_large_image" />
      <meta name="twitter:site"             content="@fizitelecom" />
      <meta name="twitter:title"            content={fullTitle} />
      <meta name="twitter:description"      content={safeDesc} />
      <meta name="twitter:image"            content={image} />
      <meta name="twitter:image:alt"        content={fullTitle} />

      {/* ── JSON-LD ── */}
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
