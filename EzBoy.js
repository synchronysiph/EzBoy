javascript:(async()=>{
const apiKey = prompt("Insira sua API Key do OpenRouter:");
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
const popup = document.createElement('divz-index:9999;
  background:#222;color:#fff;padding:0;border-radius:10px;
  box-shadow:0 0 10px rgba(0,0,0,0.5);
  max-width:400px;width:400px;
  font-family: Arial, sans-serif; transition:all 0.3s; overflow:hidden;
`;

// Barra superior sempre visível
const barra = document.createElement('div');
barra.style = "display:flex;justify-content:space-between;align-items:center;padding:15px 15px 0 15px;";
barra.innerHTML = `<b>EzBoy IA</b>`;
const minimize = document.createElement('button');
minimize.innerText = '–';
minimize.style = 'background:#f1c40f;color:#000;border:none;padding:3px 12px;cursor:pointer;border-radius:5px;font-size:18px';
barra.appendChild(minimize);
popup.appendChild(barra);

// Conteúdo que some/volta ao minimizar/maximizar
const conteudo = document.createElement('div');
conteudo.style = "padding:0 15px 15px 15px;";
popup.appendChild(conteudo);

const textArea = document.createElement('textarea');
textArea.value = document.body.innerText;
textArea.style = `
  width:100%;height:200px;
  background:#111;color:#fff;
  border:1px solid #555;border-radius:5px;padding:5px;
  resize:vertical;
  box-sizing:border-box;
  display:block;
`;
conteudo.appendChild(textArea);

const gerarBtn = document.createElement('button');
gerarBtn.innerText = '🧠 Gerar.style = 'margin-top:10px;background:#27ae60;color:#fff;border:none;padding:5px 10px;cursor:pointer;border-radius:5px;display:block;';
conteudo.appendChild(gerarBtn);

const respostaArea = document.createElement('div');
respostaArea.style = `
  margin-top:10px;background:#333;padding:10px;border-radius:5px;
  max-height:250px;overflow-y:auto;
  display:none;
  font-size:15px;line-height:1.5;
  box-sizing:border-box;
`;
conteudo.appendChild(respostaArea);

document.body.appendChild(popup);

// --- Minimizar/maximizar botão ---
let isMinimized = false;
let isResposta = false;

minimize.onclick = ()=>{
    if(isMinimized){
        conteudo.style.display = '';
        popup.style.width = "400px";
        popup.style.maxWidth = "400px";
        popup.style.height = "";
        popup.style.borderRadius = "10px";
        minimize.innerText = '–';
        isMinimized = false;
    } else {
        conteudo.style.display = 'none';
        popup.style.width = "60px";
        popup.style.maxWidth = "60px";
        popup.style.height = "36px";
        popup.style.borderRadius = "10px";
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

  // Mantém popup compacto, só resposta tem scroll
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