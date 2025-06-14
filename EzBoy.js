(() => {
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
  popup.innerHTML = '✅ <b>Funcionando!</b> <br>EzBoy carregado.';
  
  const closeBtn = document.createElement('button');
  closeBtn.innerText = 'Fechar';
  closeBtn.style.marginTop = '10px';
  closeBtn.style.padding = '5px 10px';
  closeBtn.style.border = 'none';
  closeBtn.style.borderRadius = '5px';
  closeBtn.style.background = '#e74c3c';
  closeBtn.style.color = '#fff';
  closeBtn.style.cursor = 'pointer';

  closeBtn.onclick = () => popup.remove();
  popup.appendChild(closeBtn);

  document.body.appendChild(popup);
})();
