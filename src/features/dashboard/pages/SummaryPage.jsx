import { motion, useReducedMotion } from "framer-motion";

import { ModerationQueue } from "../components/ModerationQueue.jsx";
import { QuickActions } from "../components/QuickActions.jsx";
import { RatingHighlight } from "../components/RatingHighlight.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { SummaryHeader } from "../components/SummaryHeader.jsx";
import {
  bestRatedProfessor,
  moderationItems,
  quickActions,
  summaryStats,
} from "../data/summary.mock.js";

export function SummaryPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="mx-auto w-full max-w-[1024px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
      <SummaryHeader />

      <motion.section
        aria-label="Estadísticas generales"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: shouldReduceMotion ? 0 : 0.045,
            },
          },
        }}
        className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {summaryStats.map((stat) => (
          <StatCard key={stat.id} {...stat} reduceMotion={shouldReduceMotion} />
        ))}
      </motion.section>

      <div className="mt-5 grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_310px]">
        <ModerationQueue items={moderationItems} />

        <div className="space-y-4">
          <RatingHighlight
            rating={bestRatedProfessor.rating}
            maximumRating={bestRatedProfessor.maximumRating}
            professor={bestRatedProfessor.professor}
          />

          <QuickActions actions={quickActions} />
        </div>
      </div>
    </div>
  );
}
