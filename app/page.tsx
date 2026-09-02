import ModalProvider from "@/components/ModalProvider";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Values from "@/components/Values";
import BestSellers from "@/components/BestSellers";
import PhotoBand from "@/components/PhotoBand";
import MenuSection from "@/components/MenuSection";
import CateringSection from "@/components/CateringSection";
import Locations from "@/components/Locations";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import { photoBands } from "@/lib/content";

/**
 * The one-pager, in the blueprint's own order (facts SS4, thirteen bands).
 * Every string comes from lib/content.ts.
 */
export default function Home() {
  return (
    <ModalProvider>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Values />
        <BestSellers />
        <PhotoBand {...photoBands.fries} />
        <MenuSection />
        <PhotoBand {...photoBands.spread} />
        <CateringSection />
        <Locations />
        <PhotoBand {...photoBands.chicken} />
        <Reviews />
        <PhotoBand {...photoBands.phone} />
      </main>
      <Footer />
    </ModalProvider>
  );
}
