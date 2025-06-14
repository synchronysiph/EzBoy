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

// --- Popup principal ---
const popup = document.createElement('div');
popup.style = `
  position:fixed;top:10px;right:10px;z-index:9999;
  background:#222;color:#fff;padding:15px;border-radius:10px;
  box-shadow:0 0 10px rgba(0,0,0,0.5);
  max-width:400px;width:400px;
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
  box-sizing:border-box;
  display:block;
`;
popup.appendChild(textArea);

const gerarBtn = document.createElement('button');
gerarBtn.innerText = '🧠 Gerar Resposta';
gerarBtn.style = 'margin-top:10px;background:#27ae60;color:#fff;border:none;padding:5px 10px;cursor:pointer;border-radius:5px;display:block;';
popup.appendChild(gerarBtn);

const respostaArea = document.createElement('div');
respostaArea.style = `
  margin-top:10px;background:#333;padding:10px;border-radius:5px;
  max-height:250px;overflow-y:auto;
  display:none;
  font-size:15px;line-height:1.5;
  box-sizing:border-box;
`;
popup.appendChild(respostaArea);

document.body.appendChild(popup);

// --- Minimizar/maximizar botão ---
const minimize = popup.querySelector('#ezboy-minimize');
let isMinimized = false;
let isResposta = false; // se está mostrando resposta

minimize.onclick = ()=>{
    if (isMinimized) {
        // Restaurar popup
        popup.style.maxWidth = "400px";
        popup.style.width = "400px";
        popup.style.height = "";
        popup.style.borderRadius = "10px";
        if(isResposta){
            respostaArea.style.display = '';
            textArea.style.display = 'none';
            gerarBtn.style.display = 'none';
        } else {
            textArea.style.display = '';
            gerarBtn.style.display = '';
            respostaArea.style.display = respostaArea.innerHTML.trim() ? '' : 'none';
        }
        minimize.innerText = '–';
        isMinimized = false;
    } else {
        // Minimizar popup
        popup.style.maxWidth = "60px";
        popup.style.width = "60px";
        popup.style.height = "36px";
        popup.style.borderRadius = "10px";
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
  isResposta = true;

  // Não expandir popup, só deixa a área da resposta com scroll, popup fica sempre compacto
  popup.style.maxWidth = "400px";
  popup.style.width = "400px";
  popup.style.height = "";
  popup.style.borderRadius = "10px";

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
    respostaArea.innerHTML = `<pre style="white-space:pre-wrap;margin:0;font-size:15px;">${reply}</pre>`;
  } catch(err){
    respostaArea.innerHTML = '❌ Erro: '+err.message;
  }
};

})();