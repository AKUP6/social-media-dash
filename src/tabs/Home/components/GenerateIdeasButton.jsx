/**
 * @param {{ onClick: () => void }} props
 */
export default function GenerateIdeasButton({ onClick }) {
  return (
    <button type="button" className="btn btn-primary" style={{ borderRadius: 8 }} onClick={onClick}>
      Generate ideas
    </button>
  )
}
