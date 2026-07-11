export function OerFooter({ title }) {
  return (
    <footer className="oer-footer" style={{
      textAlign: 'center', padding: '1.5rem 1rem', fontSize: '0.85rem', opacity: 0.75
    }}>
      <p>
        <strong>{title}</strong> von Dirk Schulenburg ·{' '}
        <a href="https://creativecommons.org/licenses/by/4.0/deed.de"
           target="_blank" rel="noopener noreferrer license">Inhalte CC&nbsp;BY&nbsp;4.0</a>
        {' · '}
        <a href="https://opensource.org/license/mit" target="_blank" rel="noopener noreferrer license">Code MIT</a>
        {' · '}
        <a href="https://dirk-schulenburg.net" target="_blank" rel="noopener noreferrer">dirk-schulenburg.net</a>
      </p>
    </footer>
  );
}
