import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { reviewApi } from '../../api/endpoints.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { AsyncBoundary } from '../../components/StateViews.jsx';
import { Card, Field, Modal } from '../../components/ui.jsx';

const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

// Describe what a review is about (a dine-in visit or a takeaway order), so it
// is never an anonymous rating.
function visitLabel(review) {
  const reservation = review?.reservation;
  const order = review?.order;
  if (reservation) {
    const parts = [];
    if (reservation.date) parts.push(`Visit on ${reservation.date}`);
    if (reservation.table?.tableNumber) parts.push(`Table ${reservation.table.tableNumber}`);
    return parts.join(' · ') || 'a dine-in visit';
  }
  if (order) {
    const when = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '';
    return `Takeaway order${when ? ` · ${when}` : ''}`;
  }
  return 'a past visit';
}

// The food items a review's order/reservation contained, if any.
function reviewItems(review) {
  return review?.order?.items || review?.reservation?.order?.items || [];
}

/** F07 — public reviews feed + the customer's own reviews (edit/delete). */
export default function ReviewsPage() {
  const toast = useToast();
  const { data, loading, error, reload } = useAsync(() => reviewApi.list(), []);
  const reviews = data?.data || [];
  const avg = data?.meta?.averageRating || 0;
  const total = data?.meta?.total || 0;

  const [mine, setMine] = useState([]);
  const [editing, setEditing] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const loadMine = useCallback(() => {
    reviewApi.mine().then((r) => setMine(r.data)).catch((err) => toast.error(`Could not load your reviews: ${err.message}`));
  }, [toast]);
  useEffect(() => { loadMine(); }, [loadMine]);

  const refreshAll = () => { reload(); loadMine(); };

  const remove = async (review) => {
    if (!window.confirm('Delete this review? This cannot be undone.')) return;
    setBusyId(review._id);
    try {
      await reviewApi.remove(review._id);
      toast.info('Review deleted');
      refreshAll();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <div className="row between">
        <h1>Customer Reviews</h1>
        <div className="stat" style={{ minWidth: 160 }}>
          {total > 0 ? (
            <>
              <div className="stat-value">{stars(Math.round(avg))}<span className="muted"> {avg}</span></div>
              <div className="stat-label">{total} review(s)</div>
            </>
          ) : (
            <>
              <div className="stat-value muted">New</div>
              <div className="stat-label">No ratings yet</div>
            </>
          )}
        </div>
      </div>
      <p className="muted">
        Reviews can only be left for a completed reservation.{' '}
        <Link to="/reservations">Go to your reservations</Link> to review a past visit.
      </p>

      {/* The customer's own reviews — editable and deletable. */}
      {mine.length > 0 && (
        <>
          <div className="section-head mt"><h2 style={{ margin: 0 }}>Your reviews</h2></div>
          <div className="grid grid-2">
            {mine.map((r) => (
              <Card key={r._id}>
                <div className="row between">
                  <strong className="text-sm">{visitLabel(r)}</strong>
                  <span style={{ color: 'var(--warn)' }}>{stars(r.rating)}</span>
                </div>
                {reviewItems(r).length > 0 && (
                  <p className="text-sm muted">Items: {reviewItems(r).map((i) => `${i.quantity}× ${i.name}`).join(', ')}</p>
                )}
                <p>{r.comment || <span className="muted">No comment</span>}</p>
                <div className="row mt" style={{ gap: '0.35rem' }}>
                  <button className="btn btn-sm btn-ghost" onClick={() => setEditing(r)} disabled={busyId === r._id}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => remove(r)} disabled={busyId === r._id}>Delete</button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <div className="section-head mt"><h2 style={{ margin: 0 }}>What guests are saying</h2></div>
      <AsyncBoundary
        loading={loading}
        error={error}
        isEmpty={reviews.length === 0}
        onRetry={reload}
        emptyProps={{ title: 'No reviews yet', hint: 'Be the first to review a completed visit.' }}
      >
        <div className="grid grid-2">
          {reviews.map((r) => (
            <Card key={r._id}>
              <div className="row between">
                <strong>{r.customer?.name || 'Guest'}</strong>
                <span style={{ color: 'var(--warn)' }}>{stars(r.rating)}</span>
              </div>
              <p className="text-sm muted">{visitLabel(r)} · {new Date(r.createdAt).toLocaleDateString()}</p>
              <p>{r.comment || <span className="muted">No comment</span>}</p>
            </Card>
          ))}
        </div>
      </AsyncBoundary>

      {editing && (
        <EditReviewModal
          key={editing._id}
          review={editing}
          onClose={() => setEditing(null)}
          onDone={() => { setEditing(null); refreshAll(); }}
        />
      )}
    </>
  );
}

function EditReviewModal({ review, onClose, onDone }) {
  const toast = useToast();
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment || '');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      await reviewApi.update(review._id, { rating, comment });
      toast.success('Review updated');
      onDone();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open
      title="Edit your review"
      onClose={onClose}
      footer={<><button className="btn btn-ghost" onClick={onClose} disabled={busy}>Cancel</button><button className="btn" onClick={submit} disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button></>}
    >
      <p className="text-sm muted">{visitLabel(review)}</p>
      <Field label="Rating">
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{stars(n)} ({n})</option>)}
        </select>
      </Field>
      <Field label="Comment">
        <textarea rows="4" value={comment} onChange={(e) => setComment(e.target.value)} maxLength={600} />
      </Field>
    </Modal>
  );
}
