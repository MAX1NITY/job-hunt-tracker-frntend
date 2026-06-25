import './ContactCardSkeleton.css'

export default function ContactCardSkeleton() {
  return (
    <div className="card-skeleton">
      <div className="card-skeleton__header">
        <div className="card-skeleton__info">
          <div className="shimmer card-skeleton__name" />
          <div className="shimmer card-skeleton__sub" />
        </div>
        <div className="shimmer card-skeleton__badge" />
      </div>
      <div className="shimmer card-skeleton__notes" />
      <div className="shimmer card-skeleton__notes card-skeleton__notes--short" />
    </div>
  )
}
