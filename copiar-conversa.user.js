// ==UserScript==
// @name         A5 Copiar Conversa SZ.CHAT - Luiz Toledo
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adiciona botão para copiar toda a conversa em texto no SZ.CHAT webagent UI.
// @author       Luiz Toledo
// @match        https://ggnet.sz.chat/user/agent*
// @grant        GM_setClipboard
// @run-at       document-idle
// @icon         https://raw.githubusercontent.com/devluiztoledo/copiar-conversa-sz/main/icon.png
// @updateURL    https://raw.githubusercontent.com/devluiztoledo/copiar-conversa-sz/main/copiar-conversa.user.js
// @downloadURL  https://raw.githubusercontent.com/devluiztoledo/copiar-conversa-sz/main/copiar-conversa.user.js
// ==/UserScript==

(function() {
  'use strict';


  const style = document.createElement('style');
  style.innerHTML = `
    #btn-copiar-conversa::before {
      display: none !important;
      content: none !important;
    }
    #btn-copiar-conversa {
      padding-left: 1.33333333em !important;
    }
  `;
  document.head.appendChild(style);

  const observer = new MutationObserver(() => {
    const menu = document.querySelector('.tags-sessions .menu.tags');
    const btnGerar = document.getElementById('btn-gerar-atendimento');
    if (!menu || !btnGerar || document.getElementById('btn-copiar-conversa')) return;

    const btn = document.createElement('a');
    btn.id = 'btn-copiar-conversa';
    btn.className = 'item text-ellipsis';
    btn.style.cursor = 'pointer';
    btn.textContent = 'Copiar conversa';

    btn.addEventListener('click', () => {

      const allMsgs = Array.from(document.querySelectorAll('.msg'));
      const msgs = allMsgs.filter(msg => {
        const nameEl = msg.querySelector('.message-details .name');
        return !(nameEl && nameEl.textContent.trim() === 'Responder');
      });

      const lines = msgs.map(msg => {
        const timeEl = msg.querySelector('.timestamp');
        const time = timeEl ? timeEl.textContent.trim() : '';

        const nameEl = msg.querySelector('.message-details .name');
        const name = nameEl ? nameEl.textContent.trim() : '';


        let text = '';
        const span = msg.querySelector('.message span');
        if (span) {
          text = span.textContent.trim();
        } else {
          let contentEl = msg.querySelector('.message');
          if (!contentEl) contentEl = msg.querySelector('.txt');
          text = contentEl ? contentEl.textContent.trim() : '';
        }
        text = text.replace(/\bResponder\s*$/i, '').trim();

        return `${time} ${name}: ${text}`;
      });

      GM_setClipboard(lines.join('\n'));
      alert('✅ Conversa copiada para o clipboard!');
    });


    btnGerar.parentElement.insertBefore(btn, btnGerar.nextSibling);
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
