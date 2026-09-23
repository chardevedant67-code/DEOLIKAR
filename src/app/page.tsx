import { About } from "@/components/About";
import { CTASection } from "@/components/CTASection";
import { CallButton } from "@/components/CallButton";
import { Contact } from "@/components/Contact";
import { Disclaimer } from "@/components/Disclaimer";
import { FinancialJourney } from "@/components/FinancialJourney";
import { Footer } from "@/components/Footer";
import { GoalPlanner } from "@/components/GoalPlanner";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { JourneyRail } from "@/components/JourneyRail";
import { Questions } from "@/components/Questions";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Services } from "@/components/Services";
import { SkipLink } from "@/components/SkipLink";
import { TrustBar } from "@/components/TrustBar";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { InvestmentCalculator } from "@/components/calculator/InvestmentCalculator";
import { PlannerProvider } from "@/lib/planner-context";

export default function Home() {
  return (
    <PlannerProvider>
      <SkipLink />
      <ScrollProgress />
      <Header />
      <JourneyRail />
      <main id="main" className="flex-1">
        <Hero />
        <TrustBar />
        <Services />
        <WhyChooseUs />
        <About />
        <FinancialJourney />
        <InvestmentCalculator />
        <GoalPlanner />
        <CTASection />
        <Questions />
        <Contact />
        <Disclaimer />
      </main>
      <Footer />
      <WhatsAppButton />
      <CallButton />
    </PlannerProvider>
  );
}
