import type { Job, DescriptionBreakdown } from '../../types/job';
import defaultCompanyLogo from '../../assets/default-company-logo.jpg';

export default function JobCard({
  job,
  detailed,
}: {
  job: Job;
  detailed?: boolean;
}) {
  // ✅ Safe fallback so reads like db.oneSentenceJobSummary never crash
  const db: DescriptionBreakdown =
    job.descriptionBreakdown ?? ({} as DescriptionBreakdown);

  const fmtMoney = (n?: number) =>
    typeof n === 'number' ? `$${n.toLocaleString()}` : undefined;

  const postedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString()
    : undefined;
  const updatedDate = job.updatedAt
    ? new Date(job.updatedAt).toLocaleDateString()
    : undefined;

  const mapHref = job.locationCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${job.locationCoordinates.lat},${job.locationCoordinates.lon}`
    : undefined;

  const summary = db.oneSentenceJobSummary;
  const employment = db.employmentType;
  const workModel = db.workModel;

  // Combine tags safely
  const techTags = Array.from(
    new Set([...(db.keywords ?? []), ...(job.skills_suggest ?? [])])
  );

  return (
    <div
      className="card job-card shadow-sm"
      style={{
        background: 'var(--surface-bg)',
        border: '1px solid var(--surface-border)',
      }}
    >
      <div className="card-body">
        {/* Header: logo + title/company */}
        <div className="d-flex align-items-start gap-3">
          {typeof job.owner.photo === 'string' && (
            <img
              src={
                !job.owner.photo.includes('http') || job.owner.photo === ''
                  ? defaultCompanyLogo
                  : job.owner.photo
              }
              alt={`${job.owner?.companyName ?? 'Company'} logo`}
              className="rounded"
              style={{ width: 48, height: 48, objectFit: 'cover' }}
              loading="lazy"
            />
          )}
          <div className="flex-grow-1">
            <h5 className="card-title mb-1 font-weight-bold text-primary">
              {job.title}
            </h5>
            <div className="text-muted">
              {job.owner?.companyName ?? 'Unknown Company'}
            </div>
          </div>
        </div>
        {/* Location
        <div className="mt-2">
         
        </div> */}

        {/* Compact badges */}
        {!detailed && (
          <div className="card-text mb-1">
            {job.department && (
              <span className="badge bg-secondary me-2">{job.department}</span>
            )}
            {job.seniority && (
              <span className="badge bg-info me-2">{job.seniority}</span>
            )}
            {employment && (
              <span className="badge bg-light text-dark border me-2">
                {employment}
              </span>
            )}
            {workModel && (
              <span className="badge bg-light text-dark border">
                {workModel}
              </span>
            )}
          </div>
        )}

        {/* Compact summary */}
        {!detailed && summary && (
          <p className="card-text text-truncate" style={{ maxWidth: 520 }}>
            {summary}
          </p>
        )}

        {/* Detailed view */}
        {detailed && (
          <div className="mt-3">
            {summary && <p className="fst-italic">{summary}</p>}

            <div className="row row-cols-1 row-cols-md-2 g-2 small mb-3">              
              {/* {
                <p className="card-text text-muted mb-2">
                  {mapHref ? (
                    <a
                      href={mapHref}
                      target="_blank"
                      rel="noreferrer"
                      className="link-secondary"
                      title="Open in Google Maps"
                    >
                      {job.locationAddress}
                    </a>
                  ) : (
                    job.locationAddress ||
                    'Description is available on employer website (click Apply button).'
                  )}
                </p>
              } */}
              {job.locationAddress && (
                <div className="col">
                  <strong>Location: </strong>
                  {mapHref ? (
                    <a
                      href={mapHref}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary"
                      title="Open in Google Maps"
                    >
                      {job.locationAddress}
                    </a>
                  ) : (
                    job.locationAddress ||
                    'Description is available on employer website (click Apply button).'
                  )}
                </div>
              )}
              {job.department && (
                <div className="col">
                  <strong>Department:</strong> {job.department}
                </div>
              )}
              {job.seniority && (
                <div className="col">
                  <strong>Seniority:</strong> {job.seniority}
                </div>
              )}
              {employment && (
                <div className="col">
                  <strong>Employment:</strong> {employment}
                </div>
              )}
              {workModel && (
                <div className="col">
                  <strong>Work Model:</strong> {workModel}
                </div>
              )}
              {job.type && (
                <div className="col">
                  <strong>Type:</strong> {job.type}
                </div>
              )}
              {(db.salaryRangeMinYearly || db.salaryRangeMaxYearly) && (
                <div className="col">
                  <strong>Salary:</strong>{' '}
                  {[
                    fmtMoney(db.salaryRangeMinYearly),
                    fmtMoney(db.salaryRangeMaxYearly),
                  ]
                    .filter(Boolean)
                    .join(' – ')}
                </div>
              )}
              {postedDate && (
                <div className="col">
                  <strong>Posted:</strong> {postedDate}
                </div>
              )}
              {updatedDate && (
                <div className="col">
                  <strong>Updated:</strong> {updatedDate}
                </div>
              )}
              {job.owner?.rating && (
                <div className="col">
                  <strong>Company Rating:</strong> {job.owner.rating}
                </div>
              )}
              {typeof job.owner?.teamSize === 'number' && (
                <div className="col">
                  <strong>Team Size:</strong>{' '}
                  {job.owner.teamSize.toLocaleString()}
                </div>
              )}
              {job.owner?.funding && (
                <div className="col">
                  <strong>Funding:</strong> {job.owner.funding}
                </div>
              )}
            </div>

            {/* Required Skills */}
            {db.skillRequirements?.length ? (
              <div className="mb-3">
                <strong>Required Skills:</strong>
                <ul className="mt-1">
                  {db.skillRequirements.map((skill, idx) => (
                    <li className="list-unstyled" key={idx}>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Technologies & Keywords (combined) */}
            {techTags.length > 0 && (
              <div className="mb-3">
                <strong>Technologies & Keywords:</strong>
                <div className="mt-1">
                  {techTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="badge bg-light text-dark border me-1 mb-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Company benefits */}
            {job.owner?.benefits?.benefits?.length ? (
              <div className="mb-3">
                <strong>{job.owner.benefits.title || 'Benefits'}:</strong>
                <ul className="mt-1 list-unstyled">
                  {job.owner.benefits.benefits.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Apply / external links */}
            <div className="d-flex gap-2">
              {job.url && (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  Apply Now
                </a>
              )}
              {mapHref && (
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-secondary"
                >
                  View on Map
                </a>
              )}
              {job.owner?.slug && (
                <a
                  href={`https://joinrise.co/${job.owner.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-secondary"
                >
                  Company Page
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
