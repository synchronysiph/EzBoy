javascript:(async()=>{
const apiKey = prompt("🧠 Insira sua API Key do OpenRouter (gratuita):");
if(!apiKey){ alert("🔒 API Key não fornecida."); return; }

// Teste da chave
try {
  const test = await fetch('https://openrouter.ai/api/v1/chat/completions',{
    method:'POST',
    headers:{
      'Authorization':'Bearer ' + apiKey,
      'Content-Type':'application/json'
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.3-8b-instruct:free",
      messages: [{role:"user",content:"Diga OK"}],
      temperature:0.1
    })
  });
  const jsonTest = await test.json();
  if(!jsonTest.choices){ alert("❌ Chave inválida ou erro."); return; }
} catch(e){
  alert("❌ Erro na validação: " + e.message);
  return;
}

// Popup principal
const popup = document.createElement('div');
popup.style = `
  position:fixed;top:10px;right:10px;z-index:9999;
  background:#222;color:#fff;padding:15px;border-radius:10px;
  box-shadow:0 0 10px rgba(0,0,0,0.5);max-width:400px;
  font-family: Arial, sans-serif; transition:all 0.3s; overflow:hidden;
`;

popup.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;">
  <b>🧠 EzBoy IA</b>
  <button id="ezboy-minimize" style="background:#f1c40f;color:#000;border:none;padding:3px 12px;cursor:pointer;border-radius:5px;font-size:18px">–</button>
</div><br>`;

const text = document.body.innerText;
const textArea = document.createElement('textarea');
textArea.value = text;
textArea.style = `
  width:100%;height:200px;
  background:#111;color:#fff;
  border:1px solid #555;border-radius:5px;padding:5px;
  resize:vertical;
`;
popup.appendChild(textArea);

const gerarBtn = document.createElement('button');
gerarBtn.innerText = '🧠 Gerar Resposta';
gerarBtn.style = 'margin-top:10px;background:#27ae60;color:#fff;border:none;padding:5px 10px;cursor:pointer;border-radius:5px;';
popup.appendChild(gerarBtn);

const respostaArea = document.createElement('div');
respostaArea.style = 'margin-top:10px;background:#333;padding:10px;border-radius:5px;max-height:60vh;overflow-y:auto;display:none;';
popup.appendChild(respostaArea);

document.body.appendChild(popup);

// Minimizar/maximizar botão
const minimize = popup.querySelector('#ezboy-minimize');
let isMinimized = false;
minimize.onclick = ()=>{
    if (isMinimized) {
        popup.style.maxWidth = '98vw';
        popup.style.width = popup.dataset.expanded === '1' ? '98vw' : '400px';
        popup.style.height = popup.dataset.expanded === '1' ? '96vh' : '';
        textArea.style.display = popup.dataset.expanded === '1' ? 'none' : '';
        gerarBtn.style.display = popup.dataset.expanded === '1' ? 'none' : '';
        respostaArea.style.display = '';
        minimize.innerText = '–';
        isMinimized = false;
    } else {
        popup.style.width = '60px';
        popup.style.height = '40px';
        textArea.style.display = 'none';
        gerarBtn.style.display = 'none';
        respostaArea.style.display = 'none';
        minimize.innerText = '+';
        isMinimized = true;
    }
};

gerarBtn.onclick = async()=>{
  respostaArea.innerHTML = '⏳ Processando...';
  respostaArea.style.display = '';
  textArea.style.display = 'none';
  gerarBtn.style.display = 'none';

  // Popup tela cheia (limitado)
  popup.style.width = '98vw';
  popup.style.maxWidth = '98vw';
  popup.style.height = '96vh';
  popup.style.maxHeight = '96vh';
  popup.style.borderRadius = '0';
  popup.dataset.expanded = '1';

  const promptText = `
Ignore tudo irrelevante como design, menus, anúncios...
Responda perguntas encontradas assim:
1 - B
2 - A, C
3 - Resposta direta
Apenas as respostas, sem explicações.

Texto:
${textArea.value}
`;
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions',{
      method:'POST',
      headers:{
        'Authorization':'Bearer ' + apiKey,
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        model:"meta-llama/llama-3.3-8b-instruct:free",
        messages:[{role:"user",content:promptText}],
        temperature:0.1
      })
    });
    const json = await res.json();
    const reply = json.choices?.[0]?.message?.content.trim() || '❌ Sem resposta';
    respostaArea.innerHTML = `<pre style="white-space:pre-wrap">${reply}</pre>`;
  } catch(err){
    respostaArea.innerHTML = '❌ Erro: '+err.message;
  }
};
})();