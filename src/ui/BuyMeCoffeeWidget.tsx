import React from 'react';

const BUY_ME_COFFEE_URL = 'https://www.buymeacoffee.com/himanshu1614';

export default function BuyMeCoffeeWidget({ style = {} }: { style?: React.CSSProperties }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', ...style }}>
      <a
        href={BUY_ME_COFFEE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Support me on Buy Me a Coffee"
        style={{ textDecoration: 'none' }}
      >
        <img
          src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
          alt="Buy Me A Coffee"
          style={{ height: 60, width: 217, maxWidth: '100%', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        />
      </a>
    </div>
  );
}
