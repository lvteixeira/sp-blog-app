
import React from 'react';
import { Menubar } from 'primereact/menubar';
import Logo from '@/public/logo.svg';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';

export default function MenubarCustom(props) {
  const itemRenderer = (item) => (
    <a className="flex align-items-center p-menuitem-link">
      <span className={item.icon} />
      <span className="mx-2">{item.label}</span>
      {item.badge && <Badge className="ml-auto" value={item.badge} />}
      {item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>}
    </a>
  );
  const items = [
    {
      label: 'Timeline',
      icon: 'pi pi-home',
    },
    {
      label: 'Curtidas',
      icon: 'pi pi-heart',
      badge: 3,
      template: itemRenderer,
    }
  ];

  const start = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" height="55" className="mr-2">
      <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"/>
      <path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"/>
    </svg>
  );

  const end = (
    <div className="flex align-items-center gap-2">
      <span>{props.username}</span>
      <Avatar image={props.avatar} size="xlarge" shape="circle" />
    </div>
  );

  return (
    <div className="card">
      <Menubar model={items} start={start} end={end} />
    </div>
  )
}
