export default function Header() {
  const date = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }).format(new Date());
  return <header className="topbar"><div><span className="breadcrumb">Workspace</span><span className="breadcrumb-slash">/</span><strong>Overview</strong></div><div className="header-right"><span className="today-date">{date}</span><span className="avatar" aria-label="Personal workspace">ME</span></div></header>;
}
