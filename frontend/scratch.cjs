const fs = require('fs');
const path = "c:\\Users\\Sandrielly\\semeia-nordeste\\frontend\\src\\pages\\Vendedor\\PerfilVendedor.tsx";
let content = fs.readFileSync(path, 'utf8');

function updateTypography(classNameStr) {
  let classes = classNameStr.split(/\s+/).filter(c => c.trim() !== '');
  
  let role = null;
  
  if (classes.includes('text-2xl') || classes.includes('text-[24px]')) {
    role = 'h1';
  } else if (classes.includes('text-xl')) {
    if (classes.includes('absolute') && classes.includes('left-1/2')) {
       role = 'h1'; // The main PERFIL header
    } else {
       role = 'h2';
    }
  } else if (classes.includes('text-lg')) {
    role = 'h3';
  } else if (classes.includes('text-sm')) {
    role = 'body1';
  } else if (classes.includes('text-xs') || classes.includes('text-[11px]')) {
    role = 'body2';
  } else if (classes.includes('text-[10px]') || classes.includes('text-[9px]') || classes.includes('text-[8px]')) {
    role = 'label';
  } else if (classes.includes('font-poppins')) {
    role = 'h2'; // Some titles didn't have specific sizes?
  } else if (classes.includes('font-montserrat')) {
    role = 'h3';
  } else if (classes.some(c => c.match(/^text-\[(14px|16px|18px|20px|24px|32px)\]$/))) {
     // Already processed somehow, or manual ones
  }

  if (!role) return classNameStr;

  // Remove old typography classes
  classes = classes.filter(c => {
    if (c.match(/^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|\[\d+px\])$/)) {
      return false;
    }
    if (c.match(/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black|sans|serif|mono|inter|poppins|montserrat|roboto|public-sans)$/)) {
      return false;
    }
    if (c.match(/^font-\['.*?\]$/)) return false;
    return true;
  });

  // Append new typography classes based on role
  if (role === 'h1') {
    classes.push('text-[24px]', 'md:text-[32px]', 'font-bold', "font-['Roboto']");
  } else if (role === 'h2') {
    classes.push('text-[20px]', 'md:text-[24px]', 'font-semibold', "font-['Public_Sans']");
  } else if (role === 'h3') {
    classes.push('text-[16px]', 'md:text-[18px]', 'font-semibold', "font-['Public_Sans']");
  } else if (role === 'body1') {
    classes.push('text-[14px]', 'md:text-[16px]', 'font-normal', 'font-inter');
  } else if (role === 'body2') {
    classes.push('text-[12px]', 'md:text-[14px]', 'font-normal', 'font-inter');
  } else if (role === 'label') {
    classes.push('text-[11px]', 'md:text-[12px]', 'font-normal', 'font-inter');
  }

  return classes.join(' ');
}

content = content.replace(/className=(["'])(.*?)\1/g, (match, quote, classNameStr) => {
  return `className=${quote}${updateTypography(classNameStr)}${quote}`;
});

fs.writeFileSync(path, content, 'utf8');
console.log('Done');
