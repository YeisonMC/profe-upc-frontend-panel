import {
  BookOpen,
  Building2,
  Clock3,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Star,
  ThumbsUp,
  UsersRound,
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
      {
        id: "professors",
        label: "Profesores",
        to: ROUTES.professors,
        icon: UsersRound,
      },
      {
        id: "courses",
        label: "Cursos",
        to: ROUTES.courses,
        icon: BookOpen,
      },
      {
        id: "careers",
        label: "Carreras",
        to: ROUTES.careers,
        icon: GraduationCap,
      },
      {
        id: "campuses",
        label: "Sedes",
        to: ROUTES.campuses,
        icon: Building2,
      },
    ],
  },
];
