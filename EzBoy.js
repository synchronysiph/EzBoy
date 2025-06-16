// Este código cria um popup com um botão para copiar todos os URLs de recursos (href/src) do site

(function() {
    // 1. Coletar os acessos (hrefs e srcs) de todos os links, imagens e scripts
    const links = document.querySelectorAll('a[href], link[href], img[src], script[src]');
    const urls = Array.from(links)
        .map(el => el.href || el.src)
        .filter(Boolean)
        .join('\n');

    // 2. Criar o popup
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '20px';
    popup.style.right = '20px';
    popup.style.background = '#fff';
    popup.style.border = '1px solid #888';
    popup.style.padding = '16px';
    popup.style.zIndex = 9999;
    popup.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    popup.style.borderRadius = '8px';

    // 3. Adicionar textarea com os links
    const textarea = document.createElement('textarea');
    textarea.value = urls;
    textarea.rows = 10;
    textarea.cols = 40;
    textarea.style.width = '100%';
    textarea.style.marginBottom = '8px';

    // 4. Botão de copiar
    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copiar todos os acessos';
    copyBtn.onclick = function() {
        textarea.select();
        document.execCommand('copy');
        copyBtn.textContent = 'Copiado!';
        setTimeout(() => { copyBtn.textContent = 'Copiar todos os acessos'; }, 2000);
    };

    // 5. Botão de fechar
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Fechar';
    closeBtn.style.marginLeft = '8px';
    closeBtn.onclick = function() {
        document.body.removeChild(popup);
    };

    // 6. Montar o popup
    popup.appendChild(textarea);
    popup.appendChild(copyBtn);
    popup.appendChild(closeBtn);
    document.body.appendChild(popup);
})();
