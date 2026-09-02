import type { Metadata } from "next";
import { site } from "@/lib/content";
import LegalPage, { A, H2, P, UL } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "Cosmos Burger is committed to making this website usable by everyone, including guests using assistive technology.",
};

export default function AccessibilityPage() {
  return (
    <LegalPage title="Accessibility">
      <P>
        {site.name} is committed to making this website usable by as many people as possible,
        including guests who use screen readers, keyboard navigation, magnification, or other
        assistive technology.
      </P>

      <H2>What we do</H2>
      <UL
        items={[
          "We aim to meet WCAG 2.1 Level AA.",
          "Every interactive control is reachable and operable by keyboard alone.",
          "Images that carry meaning have descriptive alternative text.",
          "Motion, the animated logo, the floating plates, the carousel and smooth scrolling, is switched off automatically when your device asks for reduced motion.",
          "Colour combinations are checked for contrast against the brand palette.",
        ]}
      />

      <H2>Third-party services</H2>
      <P>
        Ordering and catering checkout happen on Toast, DoorDash and ezCater, on their own websites.
        We do not control their accessibility, but we are happy to take your order another way if
        you hit a barrier there. Come to the counter at any of our food halls, or message us and we
        will sort it out.
      </P>

      <H2>Tell us about a problem</H2>
      <P>
        If any part of this site gets in your way, message us on{" "}
        <A href={site.instagram}>Instagram</A>. Please tell us which page and what happened, and we
        will fix it and get you what you needed in the meantime.
      </P>
    </LegalPage>
  );
}
