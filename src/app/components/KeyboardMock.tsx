import React from 'react';

interface Props {
  onReturn?: () => void;
  onKeyPress?: (key: string) => void;
}

const ROW1 = ['q','w','e','r','t','y','u','i','o','p'];
const ROW2 = ['a','s','d','f','g','h','j','k','l'];
const ROW3 = ['⇧','z','x','c','v','b','n','m','⌫'];
const ROW4 = ['123','space','return'];

function Key({
  label,
  wide,
  special,
  onPress,
}: {
  label: string;
  wide?: 'sm' | 'lg' | 'xl';
  special?: boolean;
  onPress?: () => void;
}) {
  const widthMap = {
    sm: 46,
    lg: 90,
    xl: 170,
  };
  const w = wide ? widthMap[wide] : 33;

  return (
    <button
      onMouseDown={e => { e.preventDefault(); onPress?.(); }}
      className={`flex items-center justify-center rounded-[5px] text-black active:scale-95 transition-transform select-none ${
        special ? 'bg-[#adb3bc]' : 'bg-white'
      }`}
      style={{
        height: 42,
        width: w,
        minWidth: w,
        fontSize: label === 'space' ? 0 : 15,
        fontWeight: 400,
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        boxShadow: '0 1px 0 0 #898a8d',
        letterSpacing: 0,
      }}
    >
      {label === 'space' ? '' : label === '⌫' ? (
        <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
          <path d="M7.5 0.5L0.5 7L7.5 13.5H19.5V0.5H7.5Z" stroke="#333" strokeWidth="1.2" fill="none"/>
          <path d="M13 4.5L8 9.5M8 4.5L13 9.5" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ) : label}
    </button>
  );
}

export function KeyboardMock({ onReturn, onKeyPress }: Props) {
  return (
    <div
      className="select-none"
      style={{
        background: '#d1d5db',
        paddingTop: 8,
        paddingBottom: 4,
        paddingLeft: 3,
        paddingRight: 3,
      }}
    >
      {/* Row 1 */}
      <div className="flex justify-center gap-[6px] mb-[10px]">
        {ROW1.map(k => (
          <Key key={k} label={k} onPress={() => onKeyPress?.(k)} />
        ))}
      </div>

      {/* Row 2 — inset */}
      <div className="flex justify-center gap-[6px] mb-[10px] px-4">
        {ROW2.map(k => (
          <Key key={k} label={k} onPress={() => onKeyPress?.(k)} />
        ))}
      </div>

      {/* Row 3 — shift + letters + delete */}
      <div className="flex justify-center gap-[6px] mb-[10px]">
        <Key label="⇧" special onPress={() => {}} />
        <div className="flex gap-[6px]">
          {ROW3.slice(1, -1).map(k => (
            <Key key={k} label={k} onPress={() => onKeyPress?.(k)} />
          ))}
        </div>
        <Key label="⌫" special onPress={() => onKeyPress?.('Backspace')} />
      </div>

      {/* Row 4 — 123 / space / return */}
      <div className="flex justify-center gap-[6px] mb-[8px]">
        <Key label="123" wide="lg" special onPress={() => {}} />
        <Key label="space" wide="xl" onPress={() => onKeyPress?.(' ')} />
        <Key label="return" wide="lg" special onPress={onReturn} />
      </div>

      {/* Home indicator */}
      <div className="flex justify-center pb-1">
        <div className="w-32 h-[5px] rounded-full bg-black/30" />
      </div>
    </div>
  );
}
