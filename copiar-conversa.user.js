// ==UserScript==
// @name         Copiar Conversa SZ.CHAT - Luiz Toledo
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adiciona botão para copiar toda a conversa em texto no SZ.CHAT webagent UI.
// @author       Luiz Toledo
// @match        https://ggnet.sz.chat/user/agent*
// @grant        GM_setClipboard
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/devluiztoledo/copiar-conversa-sz/main/copiar-conversa.user.js
// @downloadURL  https://raw.githubusercontent.com/devluiztoledo/copiar-conversa-sz/main/copiar-conversa.user.js
// ==/UserScript==

(function() {
  'use strict';


  const style = document.createElement('style');
  style.innerHTML = `
    /* Remove o ::before (etiqueta) apenas do nosso botão */
    #btn-copiar-conversa::before {
      display: none !important;
      content: none !important;
    }
    /* Ajusta o padding para ficar igual aos outros itens */
    #btn-copiar-conversa {
      padding-left: 1.33333333em !important;
    }
  `;
  document.head.appendChild(style);

  const observer = new MutationObserver(() => {
    const menu = document.querySelector('.tags-sessions .menu.tags');
    if (!menu || document.getElementById('btn-copiar-conversa')) return;


    const btn = document.createElement('a');
    btn.id = 'btn-copiar-conversa';
    btn.className = 'item text-ellipsis';
    btn.style.cursor = 'pointer';
    btn.textContent = 'Copiar conversa';

    btn.addEventListener('click', () => {
      const msgs = Array.from(document.querySelectorAll('.msg'));
      const lines = msgs.map(msg => {
        const time = msg.querySelector('.timestamp')?.textContent.trim() || '';
        const name = msg.querySelector('.message-details .name')?.textContent.trim() || '';
        const text = msg.querySelector('.message span')?.textContent.trim() || '';
        return `${time} ${name}: ${text}`;
      });
      const output = lines.join('\n');
      GM_setClipboard(output);
      alert('✅ Conversa copiada para o clipboard!');
    });

    menu.appendChild(btn);
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
