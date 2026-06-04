import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { BRAND_TOKENS } from "@/lib/brand-tokens";
import type { AuditReportData } from "@/lib/reports/report-data";
import { formatImpactRows } from "@/lib/reports/report-data";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    color: BRAND_TOKENS.dark,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: BRAND_TOKENS.brand,
    paddingBottom: 12,
  },
  brand: {
    fontSize: 11,
    color: BRAND_TOKENS.brand,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    marginTop: 6,
  },
  url: {
    fontSize: 9,
    color: BRAND_TOKENS.fgTertiary,
    marginTop: 4,
  },
  score: {
    fontSize: 28,
    fontWeight: 700,
    color: BRAND_TOKENS.brand,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginTop: 16,
    marginBottom: 8,
    color: BRAND_TOKENS.dark,
  },
  body: {
    fontSize: 10,
    lineHeight: 1.45,
    color: "#333333",
  },
  impactCard: {
    marginBottom: 8,
    padding: 10,
    backgroundColor: "#f5f5f3",
    borderRadius: 4,
  },
  impactLabel: {
    fontSize: 8,
    textTransform: "uppercase",
    color: BRAND_TOKENS.fgTertiary,
    letterSpacing: 0.5,
  },
  impactValue: {
    fontSize: 11,
    fontWeight: 700,
    marginTop: 4,
    color: BRAND_TOKENS.brand,
  },
  finding: {
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e4",
  },
  findingTitle: {
    fontSize: 10,
    fontWeight: 700,
  },
  meta: {
    fontSize: 8,
    color: BRAND_TOKENS.fgTertiary,
    marginTop: 2,
    textTransform: "uppercase",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: BRAND_TOKENS.fgTertiary,
    borderTopWidth: 1,
    borderTopColor: "#e8e8e4",
    paddingTop: 8,
  },
  disclaimer: {
    fontSize: 8,
    color: BRAND_TOKENS.fgTertiary,
    marginTop: 12,
    fontStyle: "italic",
  },
});

export function AuditReportDocument({ data }: { data: AuditReportData }) {
  const impactRows = formatImpactRows(data.impact);
  const topFindings = data.findings.slice(0, 12);

  return (
    <Document
      title={`Torpedo Audit — ${data.url}`}
      author="Torpedo Web"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>Torpedo Website Intelligence</Text>
          <Text style={styles.title}>Audit Report</Text>
          <Text style={styles.url}>{data.url}</Text>
          {data.overallScore != null && (
            <Text style={styles.score}>{data.overallScore}/100</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Executive summary</Text>
        <Text style={styles.body}>
          {data.executiveSummary ??
            "Audit completed. Review category scores and prioritized findings below."}
        </Text>

        <Text style={styles.sectionTitle}>Business impact (ranges only)</Text>
        <Text style={styles.disclaimer}>
          Figures are indicative ranges, not financial advice or guaranteed outcomes.
        </Text>
        {impactRows.map((row) => (
          <View key={row.label} style={styles.impactCard}>
            <Text style={styles.impactLabel}>{row.label}</Text>
            <Text style={styles.impactValue}>{row.value}</Text>
            {row.narrative ? (
              <Text style={[styles.body, { marginTop: 4 }]}>{row.narrative}</Text>
            ) : null}
          </View>
        ))}

        <Text style={styles.sectionTitle}>Category scores</Text>
        {data.scores.map((s) => (
          <Text key={s.category} style={styles.body}>
            {s.category}: {s.score}/100
          </Text>
        ))}

        <Text style={styles.sectionTitle}>Priority findings</Text>
        {topFindings.length === 0 ? (
          <Text style={styles.body}>No findings recorded for this run.</Text>
        ) : (
          topFindings.map((f, i) => (
            <View key={`${f.title}-${i}`} style={styles.finding}>
              <Text style={styles.findingTitle}>{f.title}</Text>
              <Text style={styles.meta}>
                {f.category} · {f.severity} · priority {f.priorityScore}
              </Text>
              <Text style={[styles.body, { marginTop: 4 }]}>{f.description}</Text>
              {f.recommendation ? (
                <Text style={[styles.body, { marginTop: 4 }]}>
                  Fix: {f.recommendation}
                </Text>
              ) : null}
              <Text style={[styles.body, { marginTop: 4 }]}>
                Impact: {f.businessImpact}
              </Text>
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>Next steps</Text>
        <Text style={styles.body}>
          Address quick wins from the priority matrix first, then schedule a Torpedo
          strategy call for implementation support at torpedoweb.org.
        </Text>

        <Text style={styles.footer} fixed>
          Generated by Torpedo Website Intelligence · audit.torpedoweb.org ·{" "}
          {data.completedAt
            ? new Date(data.completedAt).toLocaleDateString()
            : new Date().toLocaleDateString()}
        </Text>
      </Page>
    </Document>
  );
}
