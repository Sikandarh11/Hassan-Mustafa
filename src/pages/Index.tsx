import { useState, lazy, Suspense, type ReactNode } from "react";
import { PortfolioProvider, usePortfolio } from "@/hooks/usePortfolio";
import type { SectionKey } from "@/lib/sectionVisibility";
import PageLoader from "@/components/PageLoader";
import Navbar from "@/components/Navbar";

const HeroSection = lazy(() => import("@/components/HeroSection"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
const EngineeringServicesSection = lazy(() => import("@/components/EngineeringServicesSection"));
const SkillsSection = lazy(() => import("@/components/SkillsSection"));
const ExperienceSection = lazy(() => import("@/components/ExperienceSection"));
const ResearchSection = lazy(() => import("@/components/ResearchSection"));
const ProjectsSection = lazy(() => import("@/components/ProjectsSection"));
const TeamSection = lazy(() => import("@/components/TeamSection"));
const CertificatesSection = lazy(() => import("@/components/CertificatesSection"));
const BlogSection = lazy(() => import("@/components/BlogSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const Footer = lazy(() => import("@/components/Footer"));
const WhatsAppButton = lazy(() => import("@/components/WhatsAppButton"));

const SectionFallback = () => <div className="py-24" />;

const SectionGate = ({
  sectionKey,
  children,
}: {
  sectionKey: SectionKey;
  children: ReactNode;
}) => {
  const { isSectionVisible } = usePortfolio();
  return isSectionVisible(sectionKey) ? <>{children}</> : null;
};

const Index = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <PortfolioProvider>
      {!loaded && <PageLoader brandInitials="HMHM" onComplete={() => setLoaded(true)} />}
      <div className={`min-h-screen bg-background ${loaded ? "" : "invisible"}`}>
        <Navbar />
        <main>
          <SectionGate sectionKey="profile">
            <Suspense fallback={<SectionFallback />}><HeroSection /></Suspense>
            <Suspense fallback={<SectionFallback />}><AboutSection /></Suspense>
          </SectionGate>
          <SectionGate sectionKey="services">
            <Suspense fallback={<SectionFallback />}><EngineeringServicesSection /></Suspense>
          </SectionGate>
          <SectionGate sectionKey="skills">
            <Suspense fallback={<SectionFallback />}><SkillsSection /></Suspense>
          </SectionGate>
          <SectionGate sectionKey="experience">
            <Suspense fallback={<SectionFallback />}><ExperienceSection /></Suspense>
          </SectionGate>
          <SectionGate sectionKey="projects">
            <Suspense fallback={<SectionFallback />}><ProjectsSection /></Suspense>
          </SectionGate>
          <SectionGate sectionKey="research">
            <Suspense fallback={<SectionFallback />}><ResearchSection /></Suspense>
          </SectionGate>
          <SectionGate sectionKey="team">
            <Suspense fallback={<SectionFallback />}><TeamSection /></Suspense>
          </SectionGate>
          <SectionGate sectionKey="certificates">
            <Suspense fallback={<SectionFallback />}><CertificatesSection /></Suspense>
          </SectionGate>
          <SectionGate sectionKey="blog">
            <Suspense fallback={<SectionFallback />}><BlogSection /></Suspense>
          </SectionGate>
          <Suspense fallback={<SectionFallback />}><ContactSection /></Suspense>
        </main>
        <Suspense fallback={null}><Footer /></Suspense>
        <Suspense fallback={null}><WhatsAppButton /></Suspense>
      </div>
    </PortfolioProvider>
  );
};

export default Index;
