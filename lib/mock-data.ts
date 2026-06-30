export type Platform = "X" | "Facebook" | "Instagram" | "Web" | "RSS" | "News" | "Crawler" | "Manual";
export type Sentiment = "positive" | "neutral" | "negative";
export type Priority = "low" | "medium" | "high" | "critical";
export type MentionStatus = "new" | "reviewing" | "resolved";
export type AlertStatus = "new" | "reviewing" | "resolved";
export type KeywordType =
  | "Nom"
  | "Entreprise"
  | "Hashtag"
  | "Alias"
  | "Sujet sensible";

export interface Mention {
  id: string;
  platform: Platform;
  authorName: string;
  authorHandle: string;
  content: string;
  keyword: string;
  sentiment: Sentiment;
  priority: Priority;
  status: MentionStatus;
  detectedAt: string;
  postUrl: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
}

export interface Alert {
  id: string;
  severity: Priority;
  platform: Platform;
  shortMessage: string;
  postExcerpt: string;
  keyword: string;
  detectedAt: string;
  channel: "Email" | "SMS" | "WhatsApp" | "Telegram" | "In-app";
  status: AlertStatus;
  postUrl: string;
}

export interface Keyword {
  id: string;
  label: string;
  type: KeywordType;
  platforms: Platform[];
  priority: Priority;
  active: boolean;
}

export interface WeeklyStat {
  day: string;
  mentions: number;
  critical: number;
}

export interface SentimentStat {
  label: "Positif" | "Neutre" | "Négatif";
  value: number;
  tone: "positive" | "neutral" | "negative";
}

export interface PlatformStat {
  platform: Platform;
  value: number;
  trend: string;
}

export interface ReportItem {
  id: string;
  title: string;
  summary: string;
  impact: "Élevé" | "Modéré" | "Faible";
}

export const mentions: Mention[] = [
  {
    id: "m-001",
    platform: "X",
    authorName: "Louis Martin",
    authorHandle: "@lmartin_actu",
    content: "Jean Exemple doit clarifier sa position sur le contrat Horizon.",
    keyword: "Jean Exemple",
    sentiment: "negative",
    priority: "critical",
    status: "new",
    detectedAt: "2026-06-26T13:12:00.000Z",
    postUrl: "#",
    engagement: { likes: 243, comments: 67, shares: 51 }
  },
  {
    id: "m-002",
    platform: "Facebook",
    authorName: "Observatoire Citoyen",
    authorHandle: "observatoire.citoyen",
    content:
      "L’entreprise Horizon semble liée à plusieurs décisions politiques récentes.",
    keyword: "Entreprise Horizon",
    sentiment: "negative",
    priority: "high",
    status: "reviewing",
    detectedAt: "2026-06-26T12:38:00.000Z",
    postUrl: "#",
    engagement: { likes: 188, comments: 41, shares: 26 }
  },
  {
    id: "m-003",
    platform: "X",
    authorName: "Camille Bernard",
    authorHandle: "@camillebiz",
    content:
      "Bonne initiative de Jean Exemple pour soutenir les jeunes entrepreneurs.",
    keyword: "Jean Exemple",
    sentiment: "positive",
    priority: "low",
    status: "resolved",
    detectedAt: "2026-06-26T11:44:00.000Z",
    postUrl: "#",
    engagement: { likes: 319, comments: 22, shares: 19 }
  },
  {
    id: "m-004",
    platform: "X",
    authorName: "Veille Politique",
    authorHandle: "@veillepublique",
    content: "Le hashtag #JeanExemple commence à circuler fortement ce soir.",
    keyword: "#JeanExemple",
    sentiment: "neutral",
    priority: "medium",
    status: "new",
    detectedAt: "2026-06-26T15:08:00.000Z",
    postUrl: "#",
    engagement: { likes: 121, comments: 17, shares: 35 }
  },
  {
    id: "m-005",
    platform: "Facebook",
    authorName: "Forum Local 2026",
    authorHandle: "forumlocal2026",
    content:
      "Des utilisateurs questionnent la transparence de la campagne 2026.",
    keyword: "campagne 2026",
    sentiment: "negative",
    priority: "high",
    status: "reviewing",
    detectedAt: "2026-06-26T14:21:00.000Z",
    postUrl: "#",
    engagement: { likes: 149, comments: 58, shares: 18 }
  },
  {
    id: "m-006",
    platform: "Facebook",
    authorName: "Media Scope",
    authorHandle: "mediascope.news",
    content: "Horizon Group est mentionné dans une discussion sensible.",
    keyword: "Horizon Group",
    sentiment: "negative",
    priority: "critical",
    status: "new",
    detectedAt: "2026-06-26T15:26:00.000Z",
    postUrl: "#",
    engagement: { likes: 206, comments: 79, shares: 44 }
  },
  {
    id: "m-007",
    platform: "X",
    authorName: "Julie Morel",
    authorHandle: "@jm_public",
    content:
      "Le nom J. Exemple ressort dans plusieurs réactions autour du débat.",
    keyword: "J. Exemple",
    sentiment: "neutral",
    priority: "medium",
    status: "reviewing",
    detectedAt: "2026-06-26T10:06:00.000Z",
    postUrl: "#",
    engagement: { likes: 84, comments: 9, shares: 12 }
  },
  {
    id: "m-008",
    platform: "X",
    authorName: "Pulse Civic",
    authorHandle: "@pulsecivic",
    content:
      "Des comptes évoquent un possible scandale lié à la gouvernance d’Horizon.",
    keyword: "scandale",
    sentiment: "negative",
    priority: "critical",
    status: "new",
    detectedAt: "2026-06-26T15:39:00.000Z",
    postUrl: "#",
    engagement: { likes: 265, comments: 94, shares: 73 }
  }
];

export const alerts: Alert[] = [
  {
    id: "a-001",
    severity: "critical",
    platform: "X",
    shortMessage: "Hausse rapide des mentions négatives autour du contrat Horizon.",
    postExcerpt: "Jean Exemple doit clarifier sa position sur le contrat Horizon.",
    keyword: "Jean Exemple",
    detectedAt: "2026-06-26T13:12:00.000Z",
    channel: "SMS",
    status: "new",
    postUrl: "#"
  },
  {
    id: "a-002",
    severity: "high",
    platform: "Facebook",
    shortMessage: "Discussion sensible sur l’entreprise Horizon dans un groupe local.",
    postExcerpt:
      "L’entreprise Horizon semble liée à plusieurs décisions politiques récentes.",
    keyword: "Entreprise Horizon",
    detectedAt: "2026-06-26T12:38:00.000Z",
    channel: "Email",
    status: "reviewing",
    postUrl: "#"
  },
  {
    id: "a-003",
    severity: "medium",
    platform: "X",
    shortMessage: "Le hashtag #JeanExemple gagne en volume depuis 18h.",
    postExcerpt: "Le hashtag #JeanExemple commence à circuler fortement ce soir.",
    keyword: "#JeanExemple",
    detectedAt: "2026-06-26T15:08:00.000Z",
    channel: "WhatsApp",
    status: "resolved",
    postUrl: "#"
  }
];

export const keywords: Keyword[] = [
  {
    id: "k-001",
    label: "Jean Exemple",
    type: "Nom",
    platforms: ["X", "Facebook"],
    priority: "critical",
    active: true
  },
  {
    id: "k-002",
    label: "Entreprise Horizon",
    type: "Entreprise",
    platforms: ["X", "Facebook"],
    priority: "high",
    active: true
  },
  {
    id: "k-003",
    label: "#JeanExemple",
    type: "Hashtag",
    platforms: ["X"],
    priority: "medium",
    active: true
  },
  {
    id: "k-004",
    label: "J. Exemple",
    type: "Alias",
    platforms: ["X", "Facebook"],
    priority: "medium",
    active: true
  },
  {
    id: "k-005",
    label: "Horizon Group",
    type: "Entreprise",
    platforms: ["Facebook", "X"],
    priority: "high",
    active: true
  },
  {
    id: "k-006",
    label: "scandale",
    type: "Sujet sensible",
    platforms: ["X", "Facebook"],
    priority: "critical",
    active: true
  },
  {
    id: "k-007",
    label: "corruption",
    type: "Sujet sensible",
    platforms: ["X", "Facebook"],
    priority: "critical",
    active: false
  },
  {
    id: "k-008",
    label: "campagne 2026",
    type: "Sujet sensible",
    platforms: ["X", "Facebook"],
    priority: "high",
    active: true
  }
];

export const weeklyStats: WeeklyStat[] = [
  { day: "Lun", mentions: 74, critical: 4 },
  { day: "Mar", mentions: 91, critical: 7 },
  { day: "Mer", mentions: 83, critical: 5 },
  { day: "Jeu", mentions: 118, critical: 8 },
  { day: "Ven", mentions: 128, critical: 9 },
  { day: "Sam", mentions: 96, critical: 4 },
  { day: "Dim", mentions: 88, critical: 3 }
];

export const sentimentStats: SentimentStat[] = [
  { label: "Positif", value: 22, tone: "positive" },
  { label: "Neutre", value: 44, tone: "neutral" },
  { label: "Négatif", value: 34, tone: "negative" }
];

export const platformStats: PlatformStat[] = [
  { platform: "X", value: 73, trend: "+12% cette semaine" },
  { platform: "Facebook", value: 27, trend: "-3% cette semaine" }
];

export const reports: ReportItem[] = [
  {
    id: "r-001",
    title: "Montée des signaux critiques",
    summary:
      "Les mots-clés liés à la transparence et à Horizon concentrent la majorité des mentions sensibles.",
    impact: "Élevé"
  },
  {
    id: "r-002",
    title: "Polarisation du sentiment",
    summary:
      "Les conversations positives progressent peu alors que les messages négatifs restent structurés et relayés.",
    impact: "Modéré"
  },
  {
    id: "r-003",
    title: "Traction du hashtag principal",
    summary:
      "Le hashtag #JeanExemple connaît une accélération en soirée, surtout sur X.",
    impact: "Modéré"
  }
];

export const dashboardStats = {
  mentionsToday: 128,
  criticalMentions: 9,
  negativeSentiment: 34,
  detectionTimeSeconds: 42
};
