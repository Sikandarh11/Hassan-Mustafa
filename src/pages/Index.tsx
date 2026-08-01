import { useState, lazy, Suspense } from "react";
import { PortfolioProvider } from "@/hooks/usePortfolio";
import PageLoader from "@/components/PageLoader";
import Navbar from "@/components/Navbar";

const HeroSection = lazy(() => import("@/components/HeroSection"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
// const SkillsSection = lazy(() => import("@/components/SkillsSection"));
const ExperienceSection = lazy(() => import("@/components/ExperienceSection"));
const ResearchSection = lazy(() => import("@/components/ResearchSection"));
const ProjectsSection = lazy(() => import("@/components/ProjectsSection"));
const TeamSection = lazy(() => import("@/components/TeamSection"));
const CertificatesSection = lazy(() => import("@/components/CertificatesSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const Footer = lazy(() => import("@/components/Footer"));
const WhatsAppButton = lazy(() => import("@/components/WhatsAppButton"));

const SectionFallback = () => <div className="py-24" />;

const Index = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <PortfolioProvider>
      {!loaded && <PageLoader brandInitials="HMHM" onComplete={() => setLoaded(true)} />}
      <div className={`min-h-screen bg-background ${loaded ? "" : "invisible"}`}>
        <Navbar />
        <main>
          <Suspense fallback={<SectionFallback />}><HeroSection /></Suspense>
          <Suspense fallback={<SectionFallback />}><AboutSection /></Suspense>
          {/* <Suspense fallback={<SectionFallback />}><SkillsSection /></Suspense> */}
          <Suspense fallback={<SectionFallback />}><ExperienceSection /></Suspense>
          <Suspense fallback={<SectionFallback />}><ProjectsSection /></Suspense>
          <Suspense fallback={<SectionFallback />}><ResearchSection /></Suspense>
          <Suspense fallback={<SectionFallback />}><TeamSection /></Suspense>
          <Suspense fallback={<SectionFallback />}><CertificatesSection /></Suspense>
          <Suspense fallback={<SectionFallback />}><ContactSection /></Suspense>
        </main>
        <Suspense fallback={null}><Footer /></Suspense>
        <Suspense fallback={null}><WhatsAppButton /></Suspense>
      </div>
    </PortfolioProvider>
  );
};

export default Index;
