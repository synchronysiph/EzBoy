javascript:(async()=>{

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
popup.style.maxWidth = '350px';
popup.innerHTML = '🧠 <b>Texto do Site:</b><br><br>';

const text = document.body.innerText;

const textArea = document.createElement('div');
textArea.style.maxHeight = '400px';
textArea.style.overflowY = 'auto';
textArea.style.marginTop = '10px';
textArea.innerText = text;

popup.appendChild(textArea);

const close = document.createElement('button');
close.innerText = 'Fechar';
close.style.marginTop = '10px';
close.style.background = '#e74c3c';
close.style.color = '#fff';
close.style.border = 'none';
close.style.padding = '5px 10px';
close.style.cursor = 'pointer';
close.style.borderRadius = '5px';
close.onclick = ()=>popup.remove();

popup.appendChild(close);

document.body.appendChild(popup);

})();