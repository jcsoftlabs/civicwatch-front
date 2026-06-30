import { apiClient } from "@/lib/api-client";
import type {
  Alert,
  Keyword,
  Mention,
  Platform,
  PlatformStat,
  Priority,
  ReportItem,
  Sentiment,
  SentimentStat,
  WeeklyStat
} from "@/lib/mock-data";

export interface ApiOrganization {
  id: string;
  name: string;
  slug: string;
  role?: string;
}

export interface ApiUser {
  id: string;
  fullName: string;
  email: string;
  organizations: ApiOrganization[];
}

export interface AuthResponse {
  accessToken?: string;
  user: ApiUser;
}

interface ApiMention {
  id: string;
  platform: string;
  sourceName: string;
  authorName?: string | null;
  authorHandle?: string | null;
  title?: string | null;
  content: string;
  url?: string | null;
  matchedKeywords: unknown;
  sentiment: string;
  priority: string;
  status: string;
  detectedAt: string;
  engagement?: unknown;
}

interface ApiAlert {
  id: string;
  alertType: string;
  severity: string;
  title: string;
  message: string;
  status: string;
  sentAt?: string | null;
  createdAt: string;
  mention?: ApiMention;
}

interface ApiKeyword {
  id: string;
  keyword: string;
  keywordType: string;
  priority: string;
  platforms: unknown;
  active: boolean;
}

export interface ApiMonitoredProfile {
  id: string;
  organizationId: string;
  displayName: string;
  profileType: "PERSON" | "COMPANY" | "POLITICAL_PARTY" | "BRAND" | "OTHER";
  description?: string | null;
  country: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateKeywordInput {
  monitoredProfileId?: string;
  keyword: string;
  keywordType:
    | "NAME"
    | "COMPANY"
    | "PARTY"
    | "HASHTAG"
    | "ALIAS"
    | "SENSITIVE_TOPIC"
    | "OTHER";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  platforms: Array<"X" | "FACEBOOK" | "INSTAGRAM" | "WEB" | "RSS" | "NEWS" | "CRAWLER">;
  active?: boolean;
}

export interface CreateMonitoredProfileInput {
  displayName: string;
  profileType: "PERSON" | "COMPANY" | "POLITICAL_PARTY" | "BRAND" | "OTHER";
  description?: string;
  country: string;
  active?: boolean;
}

export interface ApiRssSource {
  id: string;
  name: string;
  feedUrl: string;
  websiteUrl?: string | null;
  active: boolean;
  checkIntervalMinutes: number;
  lastCheckedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRssSourceInput {
  name: string;
  feedUrl: string;
  websiteUrl?: string;
  active?: boolean;
  checkIntervalMinutes?: number;
}

export interface ApiWebNewsProvider {
  id: string;
  organizationId: string;
  provider: "GDELT" | "NEWS_API" | "BRAVE_SEARCH" | "SERP_API" | "CUSTOM";
  label: string;
  baseUrl?: string | null;
  active: boolean;
  config?: Record<string, unknown> | null;
  lastCheckedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  hasApiKey: boolean;
}

export interface ApiWebNewsQuery {
  id: string;
  organizationId: string;
  name: string;
  query: string;
  language?: string | null;
  country?: string | null;
  active: boolean;
  checkIntervalMinutes: number;
  lastCheckedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiXConnection {
  id: string;
  organizationId: string;
  platform: "X";
  label: string;
  status: "ACTIVE" | "DISABLED" | "ERROR";
  config?: Record<string, unknown> | null;
  lastUsedAt?: string | null;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
  hasAccessToken: boolean;
  hasRefreshToken: boolean;
  hasBearerToken: boolean;
  hasApiKey: boolean;
  hasApiSecret: boolean;
  usesEnvBearerToken?: boolean;
  envBearerTokenAvailable?: boolean;
  maskedBearerToken?: string | null;
}

export interface ApiXRule {
  id: string;
  organizationId: string;
  name: string;
  query: string;
  active: boolean;
  checkIntervalMinutes: number;
  lastCheckedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateXConnectionInput {
  platform?: "X";
  label: string;
  bearerToken?: string;
  accessToken?: string;
  refreshToken?: string;
  apiKey?: string;
  apiSecret?: string;
  status?: "ACTIVE" | "DISABLED" | "ERROR";
  config?: Record<string, unknown>;
  expiresAt?: string;
  useEnvBearerToken?: boolean;
}

export interface CreateXRuleInput {
  name: string;
  query: string;
  active?: boolean;
  checkIntervalMinutes?: number;
}

export interface XCheckSummary {
  organizationId: string;
  checkedAt: string;
  rulesProcessed: number;
  createdMentions: number;
  createdAlerts: number;
  skippedDuplicates: number;
  matchedPosts: number;
  errors: string[];
  status?: "ok" | "warning" | "quota_exceeded" | "auth_error";
}

export interface CreateWebNewsProviderInput {
  provider: ApiWebNewsProvider["provider"];
  label: string;
  apiKey?: string;
  baseUrl?: string;
  active?: boolean;
  config?: Record<string, unknown>;
}

export interface CreateWebNewsQueryInput {
  name: string;
  query: string;
  language?: string;
  country?: string;
  active?: boolean;
  checkIntervalMinutes?: number;
}

export interface ApiCrawlSource {
  id: string;
  organizationId: string;
  name: string;
  baseUrl: string;
  startUrls: string[];
  allowedDomains: string[];
  active: boolean;
  respectRobotsTxt: boolean;
  checkIntervalMinutes: number;
  maxPagesPerRun: number;
  lastCrawledAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCrawlSourceInput {
  name: string;
  baseUrl: string;
  startUrls: string[];
  allowedDomains: string[];
  active?: boolean;
  respectRobotsTxt?: boolean;
  checkIntervalMinutes?: number;
  maxPagesPerRun?: number;
}

export interface ApiReport {
  id: string;
  title: string;
  summary: string;
  metrics: unknown;
  recommendations: unknown;
}

export interface DashboardStats {
  totalMentionsToday: number;
  criticalMentions: number;
  negativeSentimentPercentage: number;
  averageDetectionTimeSeconds: number;
  mentionsLast7Days: Array<{ date: string; total: number }>;
  platformDistribution: Array<{ label: string; value: number }>;
  sentimentDistribution: Array<{ label: string; value: number }>;
  topKeywords: Array<{ keyword: string; count: number }>;
  latestMentions: ApiMention[];
  criticalAlerts: ApiAlert[];
}

export interface MentionsQuery {
  platform?: string;
  sentiment?: string;
  priority?: string;
  status?: string;
  keyword?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface MentionsResponse {
  data: ApiMention[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const civicWatchApi = {
  login: (email: string, password: string) =>
    apiClient<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    }),
  me: async (token: string) => {
    const response = await apiClient<AuthResponse | ApiUser>("/auth/me", { token });
    return "user" in response ? response : { user: response };
  },
  organizations: (token: string) => apiClient<ApiOrganization[]>("/organizations", { token }),
  dashboard: (token: string, organizationId: string) =>
    apiClient<DashboardStats>(`/organizations/${organizationId}/dashboard/stats`, { token }),
  mentions: (token: string, organizationId: string, query: MentionsQuery = {}) =>
    apiClient<MentionsResponse>(`/organizations/${organizationId}/mentions`, { token, query }),
  alerts: (token: string, organizationId: string) =>
    apiClient<ApiAlert[]>(`/organizations/${organizationId}/alerts`, { token }),
  acknowledgeAlert: (token: string, organizationId: string, alertId: string) =>
    apiClient<ApiAlert>(`/organizations/${organizationId}/alerts/${alertId}/acknowledge`, {
      method: "PATCH",
      token
    }),
  keywords: (token: string, organizationId: string) =>
    apiClient<ApiKeyword[]>(`/organizations/${organizationId}/keywords`, { token }),
  createKeyword: (token: string, organizationId: string, payload: CreateKeywordInput) =>
    apiClient<ApiKeyword>(`/organizations/${organizationId}/keywords`, {
      method: "POST",
      token,
      body: JSON.stringify(payload)
    }),
  deleteKeyword: (token: string, organizationId: string, keywordId: string) =>
    apiClient<{ success: true }>(`/organizations/${organizationId}/keywords/${keywordId}`, {
      method: "DELETE",
      token
    }),
  monitoredProfiles: (token: string, organizationId: string) =>
    apiClient<ApiMonitoredProfile[]>(`/organizations/${organizationId}/profiles`, { token }),
  createMonitoredProfile: (
    token: string,
    organizationId: string,
    payload: CreateMonitoredProfileInput
  ) =>
    apiClient<ApiMonitoredProfile>(`/organizations/${organizationId}/profiles`, {
      method: "POST",
      token,
      body: JSON.stringify(payload)
    }),
  updateMonitoredProfile: (
    token: string,
    organizationId: string,
    profileId: string,
    payload: Partial<CreateMonitoredProfileInput>
  ) =>
    apiClient<ApiMonitoredProfile>(`/organizations/${organizationId}/profiles/${profileId}`, {
      method: "PATCH",
      token,
      body: JSON.stringify(payload)
    }),
  deleteMonitoredProfile: (token: string, organizationId: string, profileId: string) =>
    apiClient<{ success: true }>(`/organizations/${organizationId}/profiles/${profileId}`, {
      method: "DELETE",
      token
    }),
  rssSources: (token: string, organizationId: string) =>
    apiClient<ApiRssSource[]>(`/organizations/${organizationId}/rss-sources`, { token }),
  createRssSource: (token: string, organizationId: string, payload: CreateRssSourceInput) =>
    apiClient<ApiRssSource>(`/organizations/${organizationId}/rss-sources`, {
      method: "POST",
      token,
      body: JSON.stringify(payload)
    }),
  checkRssSourceNow: (token: string, organizationId: string, sourceId: string) =>
    apiClient<{ checkedAt: string; createdMentions: number; createdAlerts: number; skippedDuplicates: number; matchedItems: number; errors: string[] }>(
      `/organizations/${organizationId}/rss-sources/${sourceId}/check-now`,
      {
        method: "POST",
        token
      }
    ),
  webNewsProviders: (token: string, organizationId: string) =>
    apiClient<ApiWebNewsProvider[]>(`/organizations/${organizationId}/web-news/providers`, {
      token
    }),
  createWebNewsProvider: (
    token: string,
    organizationId: string,
    payload: CreateWebNewsProviderInput
  ) =>
    apiClient<ApiWebNewsProvider>(`/organizations/${organizationId}/web-news/providers`, {
      method: "POST",
      token,
      body: JSON.stringify(payload)
    }),
  webNewsQueries: (token: string, organizationId: string) =>
    apiClient<ApiWebNewsQuery[]>(`/organizations/${organizationId}/web-news/queries`, { token }),
  createWebNewsQuery: (
    token: string,
    organizationId: string,
    payload: CreateWebNewsQueryInput
  ) =>
    apiClient<ApiWebNewsQuery>(`/organizations/${organizationId}/web-news/queries`, {
      method: "POST",
      token,
      body: JSON.stringify(payload)
    }),
  checkWebNewsNow: (token: string, organizationId: string) =>
    apiClient<{
      organizationId: string;
      checkedAt: string;
      queriesProcessed: number;
      providerCalls: number;
      createdMentions: number;
      createdAlerts: number;
      skippedDuplicates: number;
      matchedResults: number;
      errors: string[];
    }>(`/organizations/${organizationId}/web-news/check-now`, {
      method: "POST",
      token
    }),
  checkWebNewsQueryNow: (token: string, organizationId: string, queryId: string) =>
    apiClient<{
      organizationId: string;
      checkedAt: string;
      queriesProcessed: number;
      providerCalls: number;
      createdMentions: number;
      createdAlerts: number;
      skippedDuplicates: number;
      matchedResults: number;
      errors: string[];
    }>(`/organizations/${organizationId}/web-news/queries/${queryId}/check-now`, {
      method: "POST",
      token
    }),
  xConnections: (token: string, organizationId: string) =>
    apiClient<ApiXConnection[]>(`/organizations/${organizationId}/x/connections`, { token }),
  createXConnection: (
    token: string,
    organizationId: string,
    payload: CreateXConnectionInput
  ) =>
    apiClient<ApiXConnection>(`/organizations/${organizationId}/x/connections`, {
      method: "POST",
      token,
      body: JSON.stringify(payload)
    }),
  updateXConnection: (
    token: string,
    organizationId: string,
    connectionId: string,
    payload: Partial<CreateXConnectionInput>
  ) =>
    apiClient<ApiXConnection>(`/organizations/${organizationId}/x/connections/${connectionId}`, {
      method: "PATCH",
      token,
      body: JSON.stringify(payload)
    }),
  xRules: (token: string, organizationId: string) =>
    apiClient<ApiXRule[]>(`/organizations/${organizationId}/x/rules`, { token }),
  createXRule: (token: string, organizationId: string, payload: CreateXRuleInput) =>
    apiClient<ApiXRule>(`/organizations/${organizationId}/x/rules`, {
      method: "POST",
      token,
      body: JSON.stringify(payload)
    }),
  updateXRule: (
    token: string,
    organizationId: string,
    ruleId: string,
    payload: Partial<CreateXRuleInput>
  ) =>
    apiClient<ApiXRule>(`/organizations/${organizationId}/x/rules/${ruleId}`, {
      method: "PATCH",
      token,
      body: JSON.stringify(payload)
    }),
  checkXNow: (token: string, organizationId: string, maxResults?: number) =>
    apiClient<XCheckSummary>(`/organizations/${organizationId}/x/check-now`, {
      method: "POST",
      token,
      body: JSON.stringify(maxResults ? { maxResults } : {})
    }),
  checkXRuleNow: (
    token: string,
    organizationId: string,
    ruleId: string,
    maxResults?: number
  ) =>
    apiClient<XCheckSummary>(`/organizations/${organizationId}/x/rules/${ruleId}/check-now`, {
      method: "POST",
      token,
      body: JSON.stringify(maxResults ? { maxResults } : {})
    }),
  crawlSources: (token: string, organizationId: string) =>
    apiClient<ApiCrawlSource[]>(`/organizations/${organizationId}/crawl-sources`, { token }),
  createCrawlSource: (
    token: string,
    organizationId: string,
    payload: CreateCrawlSourceInput
  ) =>
    apiClient<ApiCrawlSource>(`/organizations/${organizationId}/crawl-sources`, {
      method: "POST",
      token,
      body: JSON.stringify(payload)
    }),
  checkCrawlSourceNow: (token: string, organizationId: string, sourceId: string) =>
    apiClient<{
      sourceId: string;
      checkedAt: string;
      pagesVisited: number;
      pagesSkipped: number;
      pagesUpdated: number;
      mentionsCreated: number;
      alertsCreated: number;
      errors: string[];
    }>(`/organizations/${organizationId}/crawl-sources/${sourceId}/check-now`, {
      method: "POST",
      token
    }),
  reports: (token: string, organizationId: string) =>
    apiClient<ApiReport[]>(`/organizations/${organizationId}/reports`, { token })
};

export function normalizeMention(item: ApiMention): Mention {
  const keywords = toStringArray(item.matchedKeywords);
  const engagement = (item.engagement ?? {}) as Partial<Mention["engagement"]>;

  return {
    id: item.id,
    platform: normalizePlatform(item.platform),
    authorName: item.authorName ?? item.sourceName,
    authorHandle: item.authorHandle ?? item.sourceName,
    content: item.content,
    keyword: keywords[0] ?? "Mention",
    sentiment: normalizeSentiment(item.sentiment),
    priority: normalizePriority(item.priority),
    status: normalizeMentionStatus(item.status),
    detectedAt: item.detectedAt,
    postUrl: item.url ?? "#",
    engagement: {
      likes: Number(engagement.likes ?? 0),
      comments: Number(engagement.comments ?? 0),
      shares: Number(engagement.shares ?? 0)
    }
  };
}

export function normalizeAlert(item: ApiAlert): Alert {
  const mention = item.mention ? normalizeMention(item.mention) : undefined;

  return {
    id: item.id,
    severity: normalizePriority(item.severity),
    platform: mention?.platform ?? "Manual",
    shortMessage: item.title,
    postExcerpt: item.mention?.content ?? item.message,
    keyword: mention?.keyword ?? "Signal",
    detectedAt: item.sentAt ?? item.createdAt,
    channel: normalizeAlertChannel(item.alertType),
    status: normalizeAlertStatus(item.status),
    postUrl: mention?.postUrl ?? "#"
  };
}

export function normalizeKeyword(item: ApiKeyword): Keyword {
  return {
    id: item.id,
    label: item.keyword,
    type: normalizeKeywordType(item.keywordType),
    platforms: toStringArray(item.platforms).map(normalizePlatform),
    priority: normalizePriority(item.priority),
    active: item.active
  };
}

export function normalizeReport(item: ApiReport): ReportItem {
  const metrics = (item.metrics ?? {}) as { criticalAlerts?: number; negativeMentions?: number };
  return {
    id: item.id,
    title: item.title,
    summary: item.summary,
    impact:
      Number(metrics.criticalAlerts ?? 0) >= 4
        ? "Élevé"
        : Number(metrics.negativeMentions ?? 0) >= 8
          ? "Modéré"
          : "Faible"
  };
}

export function reportRecommendations(reports: ApiReport[]): string[] {
  const recommendations = reports.flatMap((report) => toStringArray(report.recommendations));
  return recommendations.length
    ? recommendations.slice(0, 3)
    : [
        "Surveiller les mentions critiques à forte visibilité.",
        "Préparer une réponse publique sur les sujets sensibles.",
        "Partager le rapport avec l'équipe communication."
      ];
}

export function normalizeDashboard(stats: DashboardStats) {
  const totalPlatform = stats.platformDistribution.reduce((sum, item) => sum + item.value, 0) || 1;
  const totalSentiment = stats.sentimentDistribution.reduce((sum, item) => sum + item.value, 0) || 1;

  return {
    cards: {
      mentionsToday: stats.totalMentionsToday,
      criticalMentions: stats.criticalMentions,
      negativeSentiment: stats.negativeSentimentPercentage,
      detectionTimeSeconds: stats.averageDetectionTimeSeconds
    },
    weeklyStats: stats.mentionsLast7Days.map<WeeklyStat>((item) => ({
      day: new Intl.DateTimeFormat("fr-FR", { weekday: "short" }).format(new Date(item.date)),
      mentions: item.total,
      critical: 0
    })),
    platformStats: stats.platformDistribution.map<PlatformStat>((item) => ({
      platform: normalizePlatform(item.label),
      value: Math.round((item.value / totalPlatform) * 100),
      trend: `${item.value} mentions`
    })),
    sentimentStats: stats.sentimentDistribution.map<SentimentStat>((item) => ({
      label: sentimentLabel(normalizeSentiment(item.label)),
      value: Math.round((item.value / totalSentiment) * 100),
      tone: normalizeSentiment(item.label)
    })),
    latestMentions: stats.latestMentions.map(normalizeMention),
    criticalAlerts: stats.criticalAlerts.map(normalizeAlert),
    topKeywords: stats.topKeywords
  };
}

function normalizePriority(value: string): Priority {
  return value.toLowerCase() as Priority;
}

function normalizeSentiment(value: string): Sentiment {
  const sentiment = value.toLowerCase();
  return sentiment === "unknown" ? "neutral" : (sentiment as Sentiment);
}

function normalizeMentionStatus(value: string): Mention["status"] {
  switch (value) {
    case "REVIEWING":
      return "reviewing";
    case "RESOLVED":
    case "IGNORED":
      return "resolved";
    default:
      return "new";
  }
}

function normalizeAlertStatus(value: string): Alert["status"] {
  return value === "ACKNOWLEDGED" ? "resolved" : value === "FAILED" ? "reviewing" : "new";
}

export function normalizePlatform(value: string): Platform {
  switch (value) {
    case "FACEBOOK":
      return "Facebook";
    case "INSTAGRAM":
      return "Instagram";
    case "WEB":
      return "Web";
    case "NEWS":
      return "News";
    case "CRAWLER":
      return "Crawler";
    case "MANUAL":
      return "Manual";
    default:
      return value === "RSS" ? "RSS" : "X";
  }
}

function normalizeKeywordType(value: string): Keyword["type"] {
  switch (value) {
    case "NAME":
      return "Nom";
    case "COMPANY":
      return "Entreprise";
    case "HASHTAG":
      return "Hashtag";
    case "ALIAS":
      return "Alias";
    case "SENSITIVE_TOPIC":
      return "Sujet sensible";
    default:
      return "Sujet sensible";
  }
}

function normalizeAlertChannel(value: string): Alert["channel"] {
  switch (value) {
    case "SMS":
      return "SMS";
    case "WHATSAPP":
      return "WhatsApp";
    case "TELEGRAM":
      return "Telegram";
    case "IN_APP":
      return "In-app";
    default:
      return "Email";
  }
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function sentimentLabel(sentiment: Sentiment): SentimentStat["label"] {
  if (sentiment === "positive") return "Positif";
  if (sentiment === "negative") return "Négatif";
  return "Neutre";
}
