import './TypingIndicator.css';

export default function TypingIndicator({ avatar }) {
  return (
    <div className="typing-row">
      <div className="typing-avatar-space">
        <img src={avatar} alt="" className="typing-avatar" />
      </div>
      <div className="typing-bubble">
        <div className="typing-dots">
          <span className="typing-dot"></span>
          <span className="typing-dot"></span>
          <span className="typing-dot"></span>
        </div>
      </div>
    </div>
  );
}
