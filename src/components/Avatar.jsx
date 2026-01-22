import './Avatar.css';

export default function Avatar({ src, alt, size = 56, isOnline = false, showStatus = true }) {
  return (
    <div className="avatar-container" style={{ width: size, height: size }}>
      <img
        src={src}
        alt={alt}
        className="avatar-image"
        style={{ width: size, height: size }}
      />
      {showStatus && isOnline && (
        <div
          className="online-status-dot"
          style={{
            width: size * 0.25,
            height: size * 0.25,
            borderWidth: size * 0.05
          }}
        />
      )}
    </div>
  );
}
