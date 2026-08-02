import { activities, certifications, education } from "@/content/profile";
import { GUTTER_GRID, RowSection } from "./Section";
import { GutterYears } from "./Bits";
import Reveal from "./Reveal";

/** One of the two `surface` shelves that frame the main content. */
export default function Background() {
  return (
    <RowSection id="background" label="Background" tone="surface">
      <ol className="space-y-12">
        {education.map((study) => (
          <li key={study.institution} className={GUTTER_GRID}>
            {study.endYear === null ? (
              <GutterYears top="Now" bottom={`to ${study.end}`} accent />
            ) : (
              <GutterYears top={study.end} />
            )}
            <div className="min-w-0">
              <Reveal>
                <h3 className="font-display text-xl leading-tight font-medium">
                  {study.institution}
                </h3>
                <p className="mt-2 font-display text-[1.05rem] text-ink-muted">
                  {study.degree} {study.field}
                </p>
                <p className="label mt-3 text-ink-faint">
                  {study.location}
                  <span className="mx-2 text-rule-strong">/</span>
                  GPA {study.gpa}
                  {study.honors && (
                    <>
                      <span className="mx-2 text-rule-strong">/</span>
                      {study.honors}
                    </>
                  )}
                </p>
              </Reveal>
            </div>
          </li>
        ))}
      </ol>

      <Reveal>
        <div className={`mt-16 border-t border-rule pt-8 ${GUTTER_GRID}`}>
          <h3 className="label mb-4 text-ink-faint lg:mb-0 lg:text-right">
            Certifications
          </h3>
          <ul className="min-w-0 divide-y divide-rule">
            {certifications.map((cert) => (
              <li
                key={cert.name}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3 first:pt-0"
              >
                <span className="font-display text-[1.05rem] text-ink">
                  {cert.name}
                </span>
                {cert.expired ? (
                  <span className="label text-ink-faint">
                    Lapsed {cert.expired}
                  </span>
                ) : (
                  <span className="label text-ink-muted">{cert.issued}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal>
        <div className={`mt-12 border-t border-rule pt-8 ${GUTTER_GRID}`}>
          <h3 className="label mb-4 text-ink-faint lg:mb-0 lg:text-right">
            Mentoring
          </h3>
          <ul className="min-w-0 space-y-5">
            {activities.map((activity) => (
              <li key={activity.organization}>
                <h4 className="font-display text-[1.15rem] font-medium">
                  {activity.role}
                  <span className="mx-2 font-normal text-rule-strong">/</span>
                  <span className="font-normal">{activity.organization}</span>
                </h4>
                <p className="label mt-2 text-ink-faint">
                  {activity.start} – {activity.end}
                </p>
                <p className="mt-3 max-w-[58ch] font-display text-[1.05rem] leading-[1.65] text-ink-muted">
                  {activity.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </RowSection>
  );
}
