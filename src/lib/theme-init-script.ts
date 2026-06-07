/** Runs before paint — app uses light theme only. */
export const THEME_INIT_SCRIPT = `(function(){try{var d=document.documentElement;d.dataset.theme='light';d.style.colorScheme='light';localStorage.setItem('torpedo-theme','light');}catch(e){document.documentElement.dataset.theme='light';document.documentElement.style.colorScheme='light';}})();`;
