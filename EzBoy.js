javascript:(() => {
  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.top = '10px';
  popup.style.right = '10px';
  popup.style.zIndex = '9999';
  popup.style.background = '#222';
  popup.style.color = '#fff';
  popup.style.padding = '15px';
  popup.style.borderRadius = '10px';
  popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
  popup.style.maxHeight = '400px';
  popup.style.overflowY = 'auto';
  popup.innerHTML = `<b>🧠 Texto do Site:</b><br><br>${document.body.innerText.substring(0, 1000)}...<br><br><button id="fechar" style="margin-top:10px;">Fechar</button>`;
  document.body.appendChild(popup);
  
  document.getElementById('fechar').onclick = () => popup.remove();
})();