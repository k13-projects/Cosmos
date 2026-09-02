import type { Metadata } from "next";
import { catering, site } from "@/lib/content";
import LegalPage, { A, H2, P } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that apply to your use of the Cosmos Burger website.",
};

/** REVIEWED BY COUNSEL: PENDING. See the note in components/LegalPage.tsx. */
const EFFECTIVE = "September 2, 2026";

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" effective={EFFECTIVE}>
      <P>
        These terms apply to your use of this website, operated by {site.operator}. By using it you
        agree to them.
      </P>

      <H2>What this website is</H2>
      <P>
        This website provides information about {site.name}, our menu, our locations, our hours and
        our catering. It is an informational site. We do not take orders or payment here.
      </P>

      <H2>Ordering happens elsewhere</H2>
      <P>
        Links to order pickup, delivery or catering take you to third-party services: Toast,
        DoorDash and {catering.provider}. Your order, payment, delivery and any refund are governed
        by that provider&apos;s terms, not ours. We do not control their pricing, availability, fees
        or delivery times.
      </P>

      <H2>Menu, prices and availability</H2>
      <P>
        The menu shown here lists what we serve. It carries no prices, and prices and availability
        can differ between our food halls and change without notice. Items sell out. The menu and
        the price in effect at the location, or on the ordering platform at the time you order, are
        the ones that apply.
      </P>

      <H2>Food allergies</H2>
      <P>
        We prepare beef, chicken, dairy, gluten, egg and other common allergens in shared kitchens,
        and we cannot guarantee any item is free of a given allergen. If you have a food allergy,
        please speak to staff at the location before ordering.
      </P>

      <H2>Hours and locations</H2>
      <P>
        Hours listed here are our regular hours and may change for holidays, for the food hall&apos;s
        own hours, or for events. A location marked Coming Soon has not opened yet. Please check
        with the location or its Google listing if you are making a special trip.
      </P>

      <H2>Our content</H2>
      <P>
        The {site.name} name, logo, photography and site content are owned by {site.operator} or its
        licensors. Please do not reproduce them commercially without permission.
      </P>

      <H2>Guest reviews</H2>
      <P>
        Quotes shown on this site are guest reviews originally published on Google and Yelp. They
        reflect those guests&apos; own experiences and opinions, and they are not a promise about
        your visit.
      </P>

      <H2>Accessibility</H2>
      <P>
        We are working to keep this site usable by everyone. See our{" "}
        <A href="/accessibility">accessibility statement</A>, and tell us if anything gets in your
        way.
      </P>

      <H2>Changes</H2>
      <P>
        We may update these terms. The effective date at the top of this page shows when they last
        changed.
      </P>

      <H2>Contact</H2>
      <P>
        Questions about these terms: message us on <A href={site.instagram}>Instagram</A>.
      </P>
    </LegalPage>
  );
}
