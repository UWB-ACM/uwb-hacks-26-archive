import UWBHacksIntroSection from "@/src/components/sponsor-page/UWBHacksIntroSection";
import WhySponsorSection from "@/src/components/sponsor-page/WhySponsorSection";
import ContactSection from "@/src/components/sponsor-page/ContactSection";
import SponsorshipPackagesSection from "@/src/components/sponsor-page/SponsorshipPackagesSection";

export default function SponsorUsPage() {
    return (
        <main className="bg-[linear-gradient(180deg,#0d83db,#53a7f5)] text-white">
            <UWBHacksIntroSection />
            <WhySponsorSection />
            <SponsorshipPackagesSection />
            <ContactSection />
        </main>
    );
}
