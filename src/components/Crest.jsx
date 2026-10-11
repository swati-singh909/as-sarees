// The A.S. Sarees shield mark, drawn in gold.
export default function Crest({ size = 36 }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 40 44" aria-hidden="true" focusable="false">
      <path d="M4 6h32v16c0 10-8 16-16 20C12 38 4 32 4 22z" fill="none" stroke="#C9A24B" strokeWidth="1.6" />
      <path d="M8 6c2-4 6-4 8 0M24 6c2-4 6-4 8 0" fill="none" stroke="#C9A24B" strokeWidth="1.2" />
      <text
        x="20"
        y="28"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="15"
        fontWeight="700"
        fill="#E3C67A"
      >
        AS
      </text>
    </svg>
  );
}
