import { portfolioData } from '../../data/portfolio';

export default function ComputerWindow() {
  return (
    <div style={{ padding: 20, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      <img 
        src="/icons/computer_explorer.png" 
        alt="PC" 
        style={{ width: 48, height: 48 }}
      />
      <div style={{ fontSize: 13, lineHeight: 1.5 }}>
        <strong>System:</strong><br/>
        Microsoft Windows 95<br/>
        4.00.950 B<br/><br/>
        <strong>Registered to:</strong><br/>
        {portfolioData.bio.name}<br/>
        {portfolioData.bio.title}<br/><br/>
        <strong>Computer:</strong><br/>
        Pentium(r) Pro<br/>
        64.0MB RAM<br/>
        Stack: React, Vite, Node
      </div>
    </div>
  );
}
