let erudaActive = false;

export const loadEruda = () => {
  if (!erudaActive && localStorage.getItem('active-eruda') === 'true') {
    const script = document.createElement('script');
    script.src = '//cdn.jsdelivr.net/npm/eruda';
    document.body.appendChild(script);
    script.onload = () => {
      const scriptInit = document.createElement('script');
      scriptInit.innerHTML = 'eruda.init()';
      document.body.appendChild(scriptInit);
      erudaActive = true;
    };
  }
};
