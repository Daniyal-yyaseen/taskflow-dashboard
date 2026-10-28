export default function CardWrapper({ children, className = '', ...props }) {
  return <section className={`card ${className}`} {...props}>{children}</section>;
}
