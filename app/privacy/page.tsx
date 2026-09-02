import type { Metadata } from "next";
import { site } from "@/lib/content";
import LegalPage, { A, H2, P, UL } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Cosmos Burger handles personal information on this website. This site collects nothing.",
};

/**
 * REVIEWED BY COUNSEL: PENDING.
 *
 * This policy describes the site as it actually is, and that is the point of
 * it: this build has no forms, no accounts, no analytics, no advertising
 * pixels and no cookies of its own. Every claim below is therefore a statement
 * that nothing is collected, rather than the usual boilerplate that quietly
 * grants a business more than it needs.
 *
 * If ANY of that changes, a catering form, an analytics script, a chat widget,
 * a pixel, this page changes in the same commit, not after. A privacy policy
 * that describes a site which no longer exists is worse than none. In
 * particular, LobsterLab's operator (the same client, Tiger Hospitality Group)
 * confirmed annual gross revenue above US$25 million, which makes it a
 * "business" under the CCPA/CPRA (Cal. Civ. Code s 1798.140(d)(1)(A)). The
 * moment this site collects personal information, the CCPA disclosures in
 * LobsterLab's own privacy page become required here too. Copy them then.
 */
const EFFECTIVE = "September 2, 2026";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" effective={EFFECTIVE}>
      <P>
        This policy explains what personal information {site.name} collects through this website.
        The short version: this website collects nothing. {site.name} is operated by{" "}
        {site.operator}.
      </P>

      <H2>Information we collect</H2>
      <P>
        None. There is no contact form, no booking form, no newsletter sign-up and no account on
        this site. We do not ask for your name, your email address, your phone number or payment
        details anywhere on it.
      </P>

      <H2>Cookies and tracking</H2>
      <P>
        This site sets no cookies of its own, and runs no analytics, advertising or session
        recording scripts. Nothing here builds a profile of you or follows you to another site.
      </P>

      <H2>Ordering and catering happen elsewhere</H2>
      <P>
        The ORDER ONLINE and ORDER CATERING buttons take you to third-party services: Toast,
        DoorDash and ezCater. Once you are on their site you are on their terms and their privacy
        policy, not ours. They will collect what they need to take your order and payment, and they
        may set their own cookies. We receive no personal information from them through this
        website.
      </P>
      <P>
        The Directions link on each location opens Google Maps, which is likewise governed by
        Google&apos;s own privacy policy.
      </P>

      <H2>Server logs</H2>
      <P>
        This site is hosted on Vercel. Like any web host, Vercel records the technical detail needed
        to serve and secure a page request, for example the IP address making it, the page asked
        for, and the browser identifying itself. We do not use those records to identify you, and we
        do not combine them with anything else.
      </P>

      <H2>Your choices</H2>
      <UL
        items={[
          "There is nothing to opt out of here, because nothing is collected.",
          "Reviews shown on this site are guest reviews published on Google and Yelp. They carry no reviewer names, and we do not add any.",
          "If you contact us on social media, that conversation is governed by that platform's privacy policy.",
        ]}
      />

      <H2>Children</H2>
      <P>
        This site is not directed at children and collects no information from anyone, including
        children.
      </P>

      <H2>Changes</H2>
      <P>
        If this site ever starts collecting information, for example if we add a catering enquiry
        form, this page will be rewritten to say exactly what is collected, why, and who it goes to,
        before that feature goes live. The effective date at the top shows when it last changed.
      </P>

      <H2>Contact</H2>
      <P>
        Questions about this policy: message us on <A href={site.instagram}>Instagram</A>, or ask at
        the counter at any of our food halls.
      </P>
    </LegalPage>
  );
}
