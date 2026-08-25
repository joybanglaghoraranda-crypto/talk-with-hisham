'use client';

import dynamic from 'next/dynamic';

const ParticleBackground = dynamic(() => import('@/components/layout/ParticleBackground'), { ssr: false });
const ReadingProgress = dynamic(() => import('@/components/layout/ReadingProgress'), { ssr: false });
const BackToTop = dynamic(() => import('@/components/layout/BackToTop'), { ssr: false });
const PwaRegister = dynamic(() => import('@/components/layout/PwaRegister'), { ssr: false });
const CommandPalette = dynamic(() => import('@/components/layout/CommandPalette'), { ssr: false });
const AiAssistantModal = dynamic(() => import('@/components/widgets/AiAssistantModal'), { ssr: false });

export default function ClientLayoutWidgets() {
  return (
    <>
      <ParticleBackground />
      <ReadingProgress />
      <BackToTop />
      <PwaRegister />
      <CommandPalette />
      <AiAssistantModal />
    </>
  );
}
