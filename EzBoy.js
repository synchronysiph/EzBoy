(async () => {
  const popup = document.createElement('div');
  popup.style = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #222;
    color: white;
    padding: 15px;
    border-radius: 10px;
    z-index: 9999;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    font-family: Arial;
  `;
  popup.innerHTML = `
    <div style="margin-bottom: 8px;">EzBoy 🤖</div>
    <input id="ezInput" placeholder="Digite a pergunta..." style="width: 180px; padding: 5px; margin-bottom: 5px; border-radius: 5px; border: none;">
    <br>
    <button id="ezBtn" style="padding: 5px 10px; background:#0f0;border:none;border-radius:5px;color:#000;">Enviar</button>
    <button id="ezClose" style="padding:5px 10px;background:#f00;border:none;border-radius:5px;color:#fff;margin-left:5px;">X</button>
    <div id="ezResult" style="margin-top:8px;font-size:14px;"></div>
  `;
  document.body.appendChild(popup);

  document.getElementById('ezBtn').onclick = async () => {
    const query = document.getElementById('ezInput').value;
    document.getElementById('ezResult').innerText = '⏳ Processando...';

    // Aqui futuramente vai a conexão com a IA
    setTimeout(() => {
      document.getElementById('ezResult').innerText = '🟢 Resposta simulada: ' + query;
    }, 1500);
  };

  document.getElementById('ezClose').onclick = () => popup.remove();
})();