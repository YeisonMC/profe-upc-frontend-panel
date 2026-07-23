import {
  Clock3,
  LayoutDashboard,
  MessageSquare,
  Star,
  ThumbsUp,
} from "lucide-react";

import { ROUTES } from "./routePaths.js";

export const adminNavigationSections = [
  {
    id: "general",
    label: "General",
    items: [
      {
        id: "summary",
        label: "Resumen",
        to: ROUTES.summary,
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: "moderation",
    label: "Moderación",
    items: [
      {
        id: "comments",
        label: "Comentarios",
        to: ROUTES.comments,
        icon: MessageSquare,
        badge: 3,
      },
      {
        id: "recommendations",
        label: "Recomendaciones",
        to: ROUTES.recommendations,
        icon: ThumbsUp,
      },
      {
        id: "opinions",
        label: "Opiniones",
        to: ROUTES.opinions,
        icon: Star,
      },
      {
        id: "periods",
        label: "Periodos",
        to: ROUTES.periods,
        icon: Clock3,
      },
    ],
  },
];
