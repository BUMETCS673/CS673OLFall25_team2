// SavedAppliedJobCard.tsx
// Renders jobs returned from /jobs/saved/list and /jobs/applied/list

import type { SavedAppliedJob } from '../../api/pages/myJobs';
import SavedJobApplyButton from './SavedJobApplyButton';

type Props = {
  job: SavedAppliedJob;
  detailed?: boolean;
  view?: 'saved' | 'applied';
  onAppliedRemove?: (jobId: number) => void; // Callback when job is successfully applied and removed
};

const fmtMoney = (n?: number) =>
  typeof n === 'number' && !Number.isNaN(n)
    ? `$${n.toLocaleString()}`
    : undefined;

const fmtDate = (ts?: number | string | null) => {
  if (ts == null) return undefined;
  const d = typeof ts === 'number' ? new Date(ts) : new Date(Number(ts));
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString();
};

export default function SavedAppliedJobCard({
  job,
  detailed,
  view,
  onAppliedRemove,
}: Props) {
  const postedDate = fmtDate(job.createdAt);
  const updatedDate = fmtDate(job.updatedAt);
  const deadline = fmtDate(job.applicationDeadline);

  const mapHref = job.locationCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${job.locationCoordinates.lat},${job.locationCoordinates.lon}`
    : undefined;

  return (
    <div
      className="card job-card shadow-sm w-100"
      style={{
        background: 'var(--surface-bg)',
        border: '1px solid var(--surface-border)',
        width: '100%',
      }}
    >
      <div className="card-body">
        <div className="d-flex align-items-start gap-3">
          <div className="flex-grow-1">
            <h5 className="card-title mb-1 fw-light text-primary">
              {job.title}
            </h5>
            <div className="text-muted">{job.company}</div>
          </div>
        </div>

        {!detailed && job.description && (
          <p className="card-text text-truncate mt-2" style={{ maxWidth: 520 }}>
            {job.description}
          </p>
        )}

        {detailed && (
          <div className="mt-3">
            {job.description && <p className="fst-italic">{job.description}</p>}

            {/* Apply button for saved jobs - only show for saved jobs in detailed view */}
            {detailed && view === 'saved' && (
              <div className="mb-3 mt-1 position-relative">
                <SavedJobApplyButton
                  job={job}
                  detailed={detailed}
                  onApplied={(jobId) => {
                    if (onAppliedRemove) {
                      onAppliedRemove(jobId);
                    }
                  }}
                />
              </div>
            )}

            <div className="row row-cols-1 row-cols-md-2 g-2 small mb-3">
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
                    job.location ||
                    'No location specified'
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
              {job.employmentType && (
                <div className="col">
                  <strong>Employment:</strong> {job.employmentType}
                </div>
              )}
              {job.type && (
                <div className="col">
                  <strong>Type:</strong> {job.type}
                </div>
              )}
              {(job.salaryMin || job.salaryMax) && (
                <div className="col">
                  <strong>Salary:</strong>{' '}
                  {[fmtMoney(job.salaryMin), fmtMoney(job.salaryMax)]
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
              {deadline && (
                <div className="col">
                  <strong>Application Deadline:</strong> {deadline}
                </div>
              )}
            </div>

            {job.requirements && (
              <div className="mb-3">
                <strong>Requirements:</strong>
                <p className="mt-1 mb-0">{job.requirements}</p>
              </div>
            )}

            {job.benefits && (
              <div className="mb-3">
                <strong>Benefits:</strong>
                <p className="mt-1 mb-0">{job.benefits}</p>
              </div>
            )}

            <div className="d-flex gap-2 align-items-center flex-wrap">
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
