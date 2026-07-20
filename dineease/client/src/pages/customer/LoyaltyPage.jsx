import { loyaltyApi } from '../../api/endpoints.js';
import { useAsync } from '../../hooks/useAsync.js';
import { AsyncBoundary } from '../../components/StateViews.jsx';
import { Card, Badge, currency } from '../../components/ui.jsx';

/** F20 Customer Loyalty and Reward Points. */
export default function LoyaltyPage() {
  const { data, loading, error, reload } = useAsync(() => loyaltyApi.get(), []);
  const info = data?.data;
  const txns = info?.transactions || [];

  return (
    <>
      <h1>Loyalty & Rewards</h1>
      <AsyncBoundary loading={loading} error={error} isEmpty={false} onRetry={reload}>
        <div className="grid grid-3 mt">
          <div className="stat">
            <div className="stat-value">{info?.balance ?? 0}</div>
            <div className="stat-label">Points balance</div>
          </div>
          <div className="stat">
            <div className="stat-value">{currency(info?.rules.redeemValue || 0)}</div>
            <div className="stat-label">Value per point</div>
          </div>
          <div className="stat">
            <div className="stat-value">{((info?.rules.earnRate || 0) * 100).toFixed(0)}%</div>
            <div className="stat-label">Earn rate on spend</div>
          </div>
        </div>

        <Card title="Transaction history" className="mt">
          {txns.length === 0 ? (
            <p className="muted">No point activity yet. Earn points on every successful payment.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Date</th><th>Type</th><th>Points</th><th>Balance</th><th>Note</th></tr></thead>
                <tbody>
                  {txns.map((t) => (
                    <tr key={t._id}>
                      <td>{new Date(t.createdAt).toLocaleString()}</td>
                      <td><Badge tone={t.type === 'earn' ? 'success' : 'warn'}>{t.type}</Badge></td>
                      <td>{t.type === 'earn' ? '+' : '−'}{t.points}</td>
                      <td>{t.balanceAfter}</td>
                      <td className="muted text-sm">{t.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </AsyncBoundary>
    </>
  );
}
