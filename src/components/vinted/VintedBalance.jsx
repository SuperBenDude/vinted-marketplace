import { useNavigate } from 'react-router-dom';
import { useEditor } from '../../context/EditorContext';
import { EditableField } from '../editor';
import './VintedBalance.css';

export default function VintedBalance({ balanceData }) {
  const navigate = useNavigate();
  const { editMode } = useEditor();

  const balance = balanceData || {
    available: 0.00,
    pending: 0.00,
    currency: 'GBP',
    startBalance: { date: '2026-01-01', amount: 0.00 },
    history: []
  };

  return (
    <div className="vinted-balance">
      {/* Header */}
      <header className="vinted-balance-header">
        <button className="vinted-back-btn" onClick={() => navigate('/vinted')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <h1>Balance</h1>
        <div className="vinted-header-spacer"></div>
      </header>

      {editMode && (
        <div className="vinted-edit-banner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit Mode Active
        </div>
      )}

      {/* Balance Content */}
      <div className="vinted-balance-content">
        {/* Main Balance Card */}
        <div className="vinted-balance-card">
          <div className="vinted-balance-amount">
            <span className="vinted-currency">£</span>
            <EditableField
              value={balance.available.toFixed(2)}
              onSave={(newValue) => {
                // Handle balance update
              }}
              className="vinted-balance-value"
            />
          </div>
          <div className="vinted-balance-label">Available balance</div>

          {balance.pending > 0 && (
            <div className="vinted-pending-balance">
              <span>Pending: £{balance.pending.toFixed(2)}</span>
            </div>
          )}

          <button className="vinted-transfer-btn">
            Transfer to bank account
          </button>
        </div>

        {/* Start Balance */}
        <div className="vinted-start-balance">
          <div className="vinted-start-balance-row">
            <span>Start balance {balance.startBalance.date}</span>
            <span>£{balance.startBalance.amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Transaction History */}
        {balance.history && balance.history.length > 0 && (
          <div className="vinted-history">
            <h3>Transaction History</h3>
            {balance.history.map((transaction) => (
              <div key={transaction.id} className="vinted-transaction">
                <div className="vinted-transaction-icon">
                  {transaction.type === 'withdrawal' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 19V5M5 12l7-7 7 7"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12l7 7 7-7"/>
                    </svg>
                  )}
                </div>
                <div className="vinted-transaction-details">
                  <div className="vinted-transaction-desc">
                    {transaction.description}
                    {transaction.account && <span className="vinted-account"> {transaction.account}</span>}
                  </div>
                  <div className="vinted-transaction-date">{transaction.date}</div>
                </div>
                <div className={`vinted-transaction-amount ${transaction.amount < 0 ? 'negative' : 'positive'}`}>
                  {transaction.amount < 0 ? '-' : '+'}£{Math.abs(transaction.amount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {(!balance.history || balance.history.length === 0) && (
          <div className="vinted-empty-history">
            <div className="vinted-empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M2 10h20"/>
              </svg>
            </div>
            <p>No transactions yet</p>
            <span>Your transaction history will appear here</span>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="vinted-bottom-nav">
        <button className="vinted-nav-item" onClick={() => navigate('/menu/vinted')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Home</span>
        </button>
        <button className="vinted-nav-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <span>Search</span>
        </button>
        <button className="vinted-nav-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <span>Sell</span>
        </button>
        <button className="vinted-nav-item" onClick={() => navigate('/vinted')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <span>Inbox</span>
        </button>
        <button className="vinted-nav-item active">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}
